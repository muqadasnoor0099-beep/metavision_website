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

/* Pipeline stage positions — a gentle left-to-right flow with one automation shortcut */
const NODE_POSITIONS: [number, number, number][] = [
  [-1.9, 0.55, 0],
  [-0.95, -0.35, 0.35],
  [0, 0.6, -0.25],
  [0.95, -0.3, 0.3],
  [1.9, 0.45, 0],
]

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 3],
]

function ConnectionLine({ start, end, isDark }: { start: [number, number, number]; end: [number, number, number]; isDark: boolean }) {
  const line = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    // Light mode now has a dark neon background — use same vivid colours as dark mode
    const material = new THREE.LineBasicMaterial({ color: '#60a5fa', opacity: isDark ? 0.4 : 0.55, transparent: true })
    return new THREE.Line(geometry, material)
  }, [start, end, isDark])

  return <primitive object={line} />
}

/* A "data packet" travelling along a connection, looping and fading at each end */
function Packet({ start, end, speed, offset }: {
  start: [number, number, number]; end: [number, number, number]; speed: number; offset: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const s = useMemo(() => new THREE.Vector3(...start), [start])
  const e = useMemo(() => new THREE.Vector3(...end), [end])

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * speed + offset) % 1
    ref.current.position.lerpVectors(s, e, t)
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = Math.sin(t * Math.PI)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={3} transparent opacity={0} />
    </mesh>
  )
}

/* A pipeline stage: pulsing core + slowly tumbling shell */
function StageNode({ position, phase, shape, isDark }: {
  position: [number, number, number]; phase: number; shape: 'oct' | 'ico' | 'box'; isDark: boolean
}) {
  const coreRef  = useRef<THREE.Mesh>(null)
  const shellRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (coreRef.current) coreRef.current.scale.setScalar(0.8 + Math.sin(t * 1.6 + phase) * 0.22)
    if (shellRef.current) {
      shellRef.current.rotation.y += 0.008
      shellRef.current.rotation.x += 0.005
    }
  })

  return (
    <group position={position}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={2.4} />
      </mesh>
      <mesh ref={shellRef}>
        {shape === 'oct' && <octahedronGeometry args={[0.22, 0]} />}
        {shape === 'ico' && <icosahedronGeometry args={[0.2, 0]} />}
        {shape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
        <meshStandardMaterial color={isDark ? '#60a5fa' : '#2563eb'} wireframe opacity={isDark ? 0.55 : 0.4} transparent />
      </mesh>
    </group>
  )
}

/* A floating task/document card with a few "text line" accents */
function FloatingCard({ position, rotation, size, isDark }: {
  position: [number, number, number]; rotation: [number, number, number]; size: [number, number]; isDark: boolean
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(...size)), [size])
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial color={isDark ? '#60a5fa' : '#2563eb'} opacity={isDark ? 0.16 : 0.10} transparent side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={isDark ? '#93c5fd' : '#60a5fa'} opacity={isDark ? 0.75 : 0.5} transparent />
      </lineSegments>
      {[0.08, -0.02, -0.12].map((y, i) => (
        <mesh key={i} position={[-size[0] * 0.18, y, 0.001]}>
          <planeGeometry args={[size[0] * (i === 0 ? 0.5 : 0.34), 0.025]} />
          <meshStandardMaterial color="#93c5fd" opacity={isDark ? 0.65 : 0.45} transparent />
        </mesh>
      ))}
    </group>
  )
}

function WorkflowScene({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.0025
    groupRef.current.rotation.x += (pointer.y * 0.1 - groupRef.current.rotation.x) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Pipeline connections */}
      {CONNECTIONS.map(([a, b], i) => (
        <ConnectionLine key={`line-${i}`} start={NODE_POSITIONS[a]} end={NODE_POSITIONS[b]} isDark={isDark} />
      ))}

      {/* Flowing data packets */}
      {CONNECTIONS.map(([a, b], i) => (
        <Packet key={`packet-${i}`} start={NODE_POSITIONS[a]} end={NODE_POSITIONS[b]} speed={0.16 + i * 0.05} offset={i * 0.21} />
      ))}

      {/* Pipeline stages */}
      {NODE_POSITIONS.map((pos, i) => (
        <StageNode key={`node-${i}`} position={pos} phase={i * 0.7} shape={i % 3 === 0 ? 'oct' : i % 3 === 1 ? 'ico' : 'box'} isDark={isDark} />
      ))}

      {/* Floating task cards */}
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.5}>
        <FloatingCard position={[-1.35, 1.5, 0.7]} rotation={[0.08, 0.32, -0.06]} size={[0.62, 0.42]} isDark={isDark} />
      </Float>
      <Float speed={0.9} rotationIntensity={0.45} floatIntensity={0.4}>
        <FloatingCard position={[1.5, -1.35, 0.6]} rotation={[-0.06, -0.28, 0.05]} size={[0.56, 0.38]} isDark={isDark} />
      </Float>
    </group>
  )
}

export default function WorkflowCanvas() {
  const isDark = useThemeColor()

  return (
    <Canvas camera={{ position: [0, 0, 5.4], fov: 48 }} dpr={[1, 2]} gl={{ alpha: true }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.32} />
      <pointLight position={[-3, 3, 3]} intensity={1.8} color="#2563eb" />
      <pointLight position={[3, -2, 2]} intensity={0.6} color="#ffffff" />
      <WorkflowScene isDark={isDark} />
    </Canvas>
  )
}
