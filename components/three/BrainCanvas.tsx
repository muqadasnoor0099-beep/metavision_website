'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* Tracks the `html.light` class so the scene can use brighter accents on dark backgrounds */
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

function Float({ children, speed = 1, floatIntensity = 1, rotationIntensity = 1 }: {
  children: React.ReactNode; speed?: number; floatIntensity?: number; rotationIntensity?: number
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime * speed
    ref.current.position.y  = Math.sin(t * 0.5)  * 0.1 * floatIntensity
    ref.current.rotation.x  = Math.sin(t * 0.31) * 0.05 * rotationIntensity
    ref.current.rotation.z  = Math.sin(t * 0.22) * 0.05 * rotationIntensity
  })
  return <group ref={ref}>{children}</group>
}

function NeuralNode({ position, phase }: { position: [number, number, number]; phase: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.scale.setScalar(0.75 + Math.sin(state.clock.elapsedTime * 1.8 + phase) * 0.25)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={2.5} />
    </mesh>
  )
}

function ConnectionLine({ start, end, isDark }: { start: [number, number, number]; end: [number, number, number]; isDark: boolean }) {
  const line = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: isDark ? '#60a5fa' : '#2563eb',
      opacity: isDark ? 0.4 : 0.18,
      transparent: true,
    })
    return new THREE.Line(geometry, material)
  }, [start, end, isDark])

  return <primitive object={line} />
}

/* ECG/heartbeat trace beneath the brain, with a travelling pulse dot */
function EKGLine() {
  const points = useMemo(
    () => EKG_POINTS.map(([x, y]) => new THREE.Vector3(x, y * 0.55 - 1.75, 0.45)),
    []
  )

  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: '#60a5fa', opacity: 0.55, transparent: true })
    return new THREE.Line(geometry, material)
  }, [points])

  const pulseRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!pulseRef.current) return
    const segments = points.length - 1
    const progress = (state.clock.elapsedTime * 0.5) % 1
    const idx = progress * segments
    const i0 = Math.floor(idx)
    const i1 = Math.min(i0 + 1, segments)
    pulseRef.current.position.lerpVectors(points[i0], points[i1], idx - i0)
  })

  return (
    <>
      <primitive object={line} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={3} />
      </mesh>
    </>
  )
}

/* Floating medical cross */
function MedicalCross({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.5, 0.16, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#60a5fa" emissiveIntensity={0.8} opacity={0.55} transparent />
      </mesh>
      <mesh>
        <boxGeometry args={[0.16, 0.5, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#60a5fa" emissiveIntensity={0.8} opacity={0.55} transparent />
      </mesh>
    </group>
  )
}

/* Inner core that pulses with a heartbeat (beat-beat-rest) rhythm */
function HeartbeatCore({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const color = isDark ? '#60a5fa' : '#2563eb'
  const baseIntensity = isDark ? 0.4 : 0.25
  const pulseGain = isDark ? 0.9 : 0.6

  useFrame((state) => {
    if (!ref.current) return
    const cycle = state.clock.elapsedTime % 1.2
    let pulse = 0
    if (cycle < 0.12) pulse = Math.sin((cycle / 0.12) * Math.PI)
    else if (cycle > 0.22 && cycle < 0.34) pulse = Math.sin(((cycle - 0.22) / 0.12) * Math.PI) * 0.6
    ref.current.scale.setScalar(0.75 + pulse * 0.18)
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = baseIntensity + pulse * pulseGain
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.75, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={baseIntensity} opacity={isDark ? 0.2 : 0.07} transparent />
    </mesh>
  )
}

const NODE_POSITIONS: [number, number, number][] = [
  [-0.8, 0.9, 0.4], [0.8, 0.9, 0.4], [-1.1, 0.2, 0.2], [1.1, 0.2, 0.2],
  [-0.9, -0.5, 0.5], [0.9, -0.5, 0.5], [0, 1.2, 0], [0, -0.9, 0.3],
  [-0.5, 0.5, 1.0], [0.5, 0.5, 1.0], [-0.6, -0.2, -0.8], [0.6, -0.2, -0.8],
  [-1.0, 0.6, -0.3], [1.0, 0.6, -0.3], [0, 0, 1.3], [-0.3, 1.0, -0.6],
  [0.3, 1.0, -0.6], [-1.2, -0.1, -0.1], [1.2, -0.1, -0.1], [0, -1.1, -0.2],
]

const CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [6, 0], [6, 1],
  [7, 4], [7, 5], [8, 0], [9, 1], [10, 4], [11, 5], [14, 8],
  [14, 9], [12, 2], [13, 3], [15, 6], [16, 6], [17, 2], [18, 3],
]

/* Two-cycle ECG/heartbeat waveform (P-QRS-T pattern) */
const EKG_POINTS: [number, number][] = [
  [-1.8, 0], [-1.5, 0], [-1.4, 0.12], [-1.3, 0],
  [-1.18, 0], [-1.12, -0.08], [-1.06, 0.85], [-1.0, -0.35], [-0.94, 0],
  [-0.8, 0.18], [-0.66, 0], [-0.5, 0],
  [0.0, 0], [0.3, 0], [0.4, 0.12], [0.5, 0],
  [0.62, 0], [0.68, -0.08], [0.74, 0.85], [0.8, -0.35], [0.86, 0],
  [1.0, 0.18], [1.14, 0], [1.4, 0],
]

function BrainScene({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  const wireColor = isDark ? '#60a5fa' : '#2563eb'

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.0035
    groupRef.current.rotation.x += (pointer.y * 0.12 - groupRef.current.rotation.x) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Left hemisphere */}
      <mesh position={[-0.28, 0, 0]}>
        <icosahedronGeometry args={[1.38, 4]} />
        <meshStandardMaterial color={wireColor} wireframe opacity={isDark ? 0.4 : 0.28} transparent />
      </mesh>

      {/* Right hemisphere */}
      <mesh position={[0.28, 0, 0]}>
        <icosahedronGeometry args={[1.38, 4]} />
        <meshStandardMaterial color={wireColor} wireframe opacity={isDark ? 0.4 : 0.28} transparent />
      </mesh>

      {/* Inner core — pulses with a heartbeat rhythm */}
      <HeartbeatCore isDark={isDark} />

      {/* Neural connections */}
      {CONNECTIONS.map(([a, b], i) => (
        <ConnectionLine key={i} start={NODE_POSITIONS[a]} end={NODE_POSITIONS[b]} isDark={isDark} />
      ))}

      {/* Neural nodes */}
      {NODE_POSITIONS.map((pos, i) => (
        <NeuralNode key={i} position={pos} phase={i * 0.6} />
      ))}

      {/* ECG trace + travelling pulse */}
      <EKGLine />

      {/* Floating medical cross */}
      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.6}>
        <MedicalCross position={[1.7, 1.05, 0.55]} />
      </Float>

      {/* Outer orbit ring */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.0, 0.008, 8, 80]} />
          <meshStandardMaterial color={wireColor} opacity={isDark ? 0.3 : 0.15} transparent />
        </mesh>
      </Float>
    </group>
  )
}

export default function BrainCanvas() {
  const isDark = useThemeColor()

  return (
    <Canvas camera={{ position: [0, 0, 4.8], fov: 48 }} dpr={[1, 2]} gl={{ alpha: true }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.25} />
      <pointLight position={[-3, 3, 3]} intensity={2} color="#2563eb" />
      <pointLight position={[3, -2, -2]} intensity={0.6} color="#ffffff" />
      <BrainScene isDark={isDark} />
    </Canvas>
  )
}
