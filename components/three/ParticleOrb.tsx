'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 2200
const RADIUS = 1.72
const MOUSE_REPEL = 0.38      // strength of push
const MOUSE_REACH = 0.72      // world-space radius of influence
const SPRING = 0.055          // snap-back speed
const DAMPING = 0.78          // velocity damping
const BURST_STRENGTH = 0.22   // mode-switch scatter

// Fibonacci sphere — perfectly even distribution
function fibonacciSphere(n: number, r: number): Float32Array {
  const pos = new Float32Array(n * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const theta = golden * i
    pos[i * 3]     = Math.cos(theta) * rad * r
    pos[i * 3 + 1] = y * r
    pos[i * 3 + 2] = Math.sin(theta) * rad * r
  }
  return pos
}

function useThemeColor() {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    const update = () => setIsDark(!document.documentElement.classList.contains('light'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return isDark
}

interface OrbProps {
  modeKey: string
  isDark: boolean
}

function OrbScene({ modeKey, isDark }: OrbProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const geoRef = useRef<THREE.BufferGeometry>(null)
  const { camera, size } = useThree()

  // Per-particle state (not React state — lives in refs for perf)
  const origin   = useMemo(() => fibonacciSphere(COUNT, RADIUS), [])
  const current  = useMemo(() => origin.slice(), [origin])
  const velocity = useMemo(() => new Float32Array(COUNT * 3), [])
  const sizes    = useMemo(() => {
    const s = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) s[i] = 2.5 + Math.random() * 2.5
    return s
  }, [])

  // Mouse in NDC
  const mouse = useRef(new THREE.Vector2(9999, 9999))
  const prevMode = useRef(modeKey)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Mode switch → burst scatter
  useEffect(() => {
    if (modeKey === prevMode.current) return
    prevMode.current = modeKey
    for (let i = 0; i < COUNT; i++) {
      const nx = origin[i * 3]     / RADIUS
      const ny = origin[i * 3 + 1] / RADIUS
      const nz = origin[i * 3 + 2] / RADIUS
      velocity[i * 3]     += nx * BURST_STRENGTH * (0.5 + Math.random())
      velocity[i * 3 + 1] += ny * BURST_STRENGTH * (0.5 + Math.random())
      velocity[i * 3 + 2] += nz * BURST_STRENGTH * (0.5 + Math.random())
    }
  }, [modeKey, origin, velocity])

  // Color
  const color = useMemo(
    () => new THREE.Color(isDark ? '#60a5fa' : '#1d4ed8'),
    [isDark]
  )

  useEffect(() => {
    if (!pointsRef.current) return
    ;(pointsRef.current.material as THREE.PointsMaterial).color.set(
      isDark ? '#60a5fa' : '#1d4ed8'
    )
  }, [isDark])

  // Raycaster for mouse → world projection
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane     = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const mouseWorld = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }) => {
    if (!pointsRef.current || !geoRef.current) return

    const t = clock.getElapsedTime()

    // Project mouse to z=0 plane
    raycaster.setFromCamera(mouse.current, camera)
    raycaster.ray.intersectPlane(plane, mouseWorld)

    // Breathing: subtle radius oscillation
    const breath = 1 + Math.sin(t * 0.55) * 0.028

    // Rotation matrix (slow Y spin)
    const angle = t * 0.09
    const cosA = Math.cos(angle), sinA = Math.sin(angle)

    const pos = geoRef.current.attributes.position.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      // Origin rotated + breathing
      const ox = origin[i3] * cosA - origin[i3 + 2] * sinA
      const oy = origin[i3 + 1]
      const oz = origin[i3] * sinA + origin[i3 + 2] * cosA
      const tx = ox * breath, ty = oy * breath, tz = oz * breath

      // Current pos
      let cx = current[i3], cy = current[i3 + 1], cz = current[i3 + 2]

      // Mouse repulsion
      const dx = cx - mouseWorld.x
      const dy = cy - mouseWorld.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_REACH && dist > 0.001) {
        const force = (1 - dist / MOUSE_REACH) * MOUSE_REPEL
        velocity[i3]     += (dx / dist) * force
        velocity[i3 + 1] += (dy / dist) * force
      }

      // Spring toward target
      velocity[i3]     += (tx - cx) * SPRING
      velocity[i3 + 1] += (ty - cy) * SPRING
      velocity[i3 + 2] += (tz - cz) * SPRING

      // Damping
      velocity[i3]     *= DAMPING
      velocity[i3 + 1] *= DAMPING
      velocity[i3 + 2] *= DAMPING

      cx += velocity[i3]
      cy += velocity[i3 + 1]
      cz += velocity[i3 + 2]

      current[i3] = cx; current[i3 + 1] = cy; current[i3 + 2] = cz
      pos[i3] = cx; pos[i3 + 1] = cy; pos[i3 + 2] = cz
    }

    geoRef.current.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[current, 3]}
          count={COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={isDark ? 0.82 : 0.7}
        depthWrite={false}
      />
    </points>
  )
}

interface Props {
  modeKey: string
}

export default function ParticleOrb({ modeKey }: Props) {
  const isDark = useThemeColor()

  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: false }}
      style={{ background: 'transparent' }}
    >
      <OrbScene modeKey={modeKey} isDark={isDark} />
    </Canvas>
  )
}
