'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Neon tube line ───────────────────────────────────────────────────────────
// Two overlapping tubes: a thin bright core + a wider semi-transparent halo.
// AdditiveBlending on the halo creates the bloom / glow without post-processing.
function NeonLine({
  start, end, coreColor, glowColor,
}: {
  start: [number, number, number]
  end:   [number, number, number]
  coreColor: string
  glowColor: string
}) {
  const { coreTube, haloTube } = useMemo(() => {
    const s     = new THREE.Vector3(...start)
    const e     = new THREE.Vector3(...end)
    const curve = new THREE.LineCurve3(s, e)
    return {
      coreTube: new THREE.TubeGeometry(curve, 1, 0.0055, 6, false),
      haloTube: new THREE.TubeGeometry(curve, 1, 0.022,  6, false),
    }
  }, [start, end])

  return (
    <group>
      {/* Bright core — the actual neon tube */}
      <mesh geometry={coreTube}>
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={8}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Wide halo — additive blend creates glow bloom */}
      <mesh geometry={haloTube}>
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={3}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// ─── Neon node dot ────────────────────────────────────────────────────────────
function NeonNode({
  position, phase = 0, color, size = 0.045,
}: {
  position: [number, number, number]
  phase?: number
  color: string
  size?: number
}) {
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!coreRef.current) return
    coreRef.current.scale.setScalar(0.7 + Math.sin(clock.elapsedTime * 1.8 + phase) * 0.3)
  })

  return (
    <group position={position}>
      {/* White-hot core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 10, 10]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={10} />
      </mesh>
      {/* Inner bloom */}
      <mesh>
        <sphereGeometry args={[size * 2.8, 10, 10]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={4}
          transparent opacity={0.22}
          depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[size * 6, 10, 10]} />
        <meshStandardMaterial
          color={color}
          transparent opacity={0.055}
          depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// ─── Flowing particle ─────────────────────────────────────────────────────────
function Packet({
  start, end, speed, offset, color,
}: {
  start: [number, number, number]
  end:   [number, number, number]
  speed: number
  offset: number
  color: string
}) {
  const ref = useRef<THREE.Mesh>(null)
  const s   = useMemo(() => new THREE.Vector3(...start), [start])
  const e   = useMemo(() => new THREE.Vector3(...end),   [end])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t   = (clock.elapsedTime * speed + offset) % 1
    ref.current.position.lerpVectors(s, e, t)
    ;(ref.current.material as THREE.MeshStandardMaterial).opacity = Math.sin(t * Math.PI)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.038, 8, 8]} />
      <meshStandardMaterial
        color={color} emissive={color} emissiveIntensity={12}
        transparent opacity={0}
      />
    </mesh>
  )
}

// ─── Network layout ───────────────────────────────────────────────────────────
const NODES: [number, number, number][] = [
  [-2.0,  0.55,  0.0],   // 0 — left anchor
  [-1.0, -0.40,  0.35],  // 1
  [ 0.0,  0.65, -0.20],  // 2 — centre
  [ 1.0, -0.30,  0.40],  // 3
  [ 2.0,  0.50,  0.0],   // 4 — right anchor
  [-0.5,  1.45,  0.30],  // 5 — top bridge
  [ 0.5, -1.35, -0.20],  // 6 — bottom bridge
]

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],   // main spine
  [1, 3],                             // cross-shortcut
  [0, 5], [5, 2], [5, 4],            // top arch
  [1, 6], [6, 3],                    // bottom arch
]

// Cycle through three neon palettes: blue · cyan · violet
const PALETTES = [
  { coreColor: '#93c5fd', glowColor: '#1d4ed8' },  // blue
  { coreColor: '#67e8f9', glowColor: '#0891b2' },  // cyan
  { coreColor: '#c4b5fd', glowColor: '#7c3aed' },  // violet
]

const NODE_COLORS = [
  '#93c5fd', '#67e8f9', '#93c5fd', '#c4b5fd', '#93c5fd', '#67e8f9', '#c4b5fd',
]

// ─── Scene ────────────────────────────────────────────────────────────────────
function NeonScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.0028
    groupRef.current.rotation.x +=
      (pointer.y * 0.12 - groupRef.current.rotation.x) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Neon tube lines */}
      {EDGES.map(([a, b], i) => (
        <NeonLine
          key={`l${i}`}
          start={NODES[a]}
          end={NODES[b]}
          {...PALETTES[i % PALETTES.length]}
        />
      ))}

      {/* Flowing particles along each edge */}
      {EDGES.map(([a, b], i) => (
        <Packet
          key={`p${i}`}
          start={NODES[a]}
          end={NODES[b]}
          speed={0.17 + i * 0.035}
          offset={i * 0.18}
          color={PALETTES[i % PALETTES.length].coreColor}
        />
      ))}

      {/* Glowing node dots */}
      {NODES.map((pos, i) => (
        <NeonNode
          key={`n${i}`}
          position={pos}
          phase={i * 0.85}
          color={NODE_COLORS[i]}
          size={i === 0 || i === 4 ? 0.06 : 0.044}
        />
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function WorkflowCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.6], fov: 47 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      {/* Near-zero ambient — let the emissive glow do all the work */}
      <ambientLight intensity={0.04} />
      {/* Blue key */}
      <pointLight position={[-3,  3,  3]} intensity={1.2} color="#2563eb" />
      {/* Cyan fill */}
      <pointLight position={[ 3, -2,  2]} intensity={1.0} color="#06b6d4" />
      {/* Violet rim */}
      <pointLight position={[ 0, -3, -2]} intensity={0.7} color="#7c3aed" />
      <NeonScene />
    </Canvas>
  )
}
