'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const BAR_HEIGHTS = [0.6, 1.1, 0.8, 1.5, 1.0, 1.35, 1.6, 1.2]

function AnimatedBar({ position, targetHeight, delay }: { position: [number, number, number]; targetHeight: number; delay: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const current = useRef(0)

  useFrame((state) => {
    if (!ref.current) return
    const t = Math.max(0, state.clock.elapsedTime - delay)
    const progress = Math.min(t / 1.2, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    current.current = targetHeight * eased
    ref.current.scale.y = Math.max(current.current, 0.01)
    ref.current.position.y = position[1] + (current.current / 2)
  })

  return (
    <mesh ref={ref} position={[position[0], position[1], position[2]]}>
      <boxGeometry args={[0.18, 1, 0.18]} />
      <meshStandardMaterial
        color="#d4af37"
        emissive="#d4af37"
        emissiveIntensity={0.5}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  )
}

function LineGraph() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < 8; i++) {
      pts.push(new THREE.Vector3(-1.4 + i * 0.4, -0.5 + [0.2, 0.5, 0.3, 0.8, 0.6, 0.9, 1.1, 0.85][i], 0.05))
    }
    return pts
  }, [])

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  return (
    <threeLine geometry={geometry}>
      <lineBasicMaterial color="#f5d060" opacity={0.6} transparent />
    </threeLine>
  )
}

function DashboardScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.18
    groupRef.current.rotation.x = -0.1 + Math.sin(state.clock.elapsedTime * 0.18) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Dashboard backing plane */}
      <mesh position={[0, 0.1, -0.1]}>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#0e0e14" opacity={0.85} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Animated bars */}
      {BAR_HEIGHTS.map((h, i) => (
        <AnimatedBar
          key={i}
          position={[-1.52 + i * 0.44, -1.1, 0]}
          targetHeight={h}
          delay={i * 0.08}
        />
      ))}

      {/* Line graph above bars */}
      <LineGraph />

      {/* Floating data cube */}
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={0.4}>
        <mesh position={[2.0, 1.1, 0.5]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color="#d4af37" wireframe opacity={0.65} transparent />
        </mesh>
      </Float>

      {/* Second floating cube */}
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.6}>
        <mesh position={[-2.1, 1.0, 0.3]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#f5d060" wireframe opacity={0.5} transparent />
        </mesh>
      </Float>
    </group>
  )
}

export default function DashboardCanvas() {
  return (
    <Canvas camera={{ position: [0, 0.3, 5.5], fov: 46 }} dpr={[1, 2]}>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 3, 4]} intensity={1.8} color="#d4af37" />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#ffffff" />
      <DashboardScene />
    </Canvas>
  )
}
