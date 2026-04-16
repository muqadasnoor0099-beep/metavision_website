'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function NeuralNode({ position, phase }: { position: [number, number, number]; phase: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.scale.setScalar(0.75 + Math.sin(state.clock.elapsedTime * 1.8 + phase) * 0.25)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={2.5} />
    </mesh>
  )
}

function ConnectionLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const line = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: '#d4af37',
      opacity: 0.18,
      transparent: true,
    })
    return new THREE.Line(geometry, material)
  }, [start, end])

  return <primitive object={line} />
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

function BrainScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

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
        <meshStandardMaterial color="#d4af37" wireframe opacity={0.28} transparent />
      </mesh>

      {/* Right hemisphere */}
      <mesh position={[0.28, 0, 0]}>
        <icosahedronGeometry args={[1.38, 4]} />
        <meshStandardMaterial color="#d4af37" wireframe opacity={0.28} transparent />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.25}
          opacity={0.07}
          transparent
        />
      </mesh>

      {/* Neural connections */}
      {CONNECTIONS.map(([a, b], i) => (
        <ConnectionLine key={i} start={NODE_POSITIONS[a]} end={NODE_POSITIONS[b]} />
      ))}

      {/* Neural nodes */}
      {NODE_POSITIONS.map((pos, i) => (
        <NeuralNode key={i} position={pos} phase={i * 0.6} />
      ))}

      {/* Outer orbit ring */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.0, 0.008, 8, 80]} />
          <meshStandardMaterial color="#d4af37" opacity={0.15} transparent />
        </mesh>
      </Float>
    </group>
  )
}

export default function BrainCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 4.8], fov: 48 }} dpr={[1, 2]}>
      <ambientLight intensity={0.25} />
      <pointLight position={[-3, 3, 3]} intensity={2} color="#d4af37" />
      <pointLight position={[3, -2, -2]} intensity={0.6} color="#ffffff" />
      <BrainScene />
    </Canvas>
  )
}
