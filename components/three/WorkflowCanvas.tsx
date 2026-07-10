'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Neon tube line ───────────────────────────────────────────────────────────
// Core  = thin bright tube  (very high emissive — the "lit" part of the neon)
// Shell = wide halo tube    (additive blend = bloom glow without post-processing)
function NeonLine({
  start, end, coreColor, shellColor,
}: {
  start: [number, number, number]
  end:   [number, number, number]
  coreColor: string
  shellColor: string
}) {
  const { core, shell } = useMemo(() => {
    const s     = new THREE.Vector3(...start)
    const e     = new THREE.Vector3(...end)
    const curve = new THREE.LineCurve3(s, e)
    return {
      core:  new THREE.TubeGeometry(curve, 1, 0.014, 8, false),   // thick bright core
      shell: new THREE.TubeGeometry(curve, 1, 0.055, 8, false),   // wide glow halo
    }
  }, [start, end])

  return (
    <group>
      <mesh geometry={core}>
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={18}
          toneMapped={false}
        />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial
          color={shellColor}
          emissive={shellColor}
          emissiveIntensity={6}
          transparent
          opacity={0.32}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// ─── Glowing node ─────────────────────────────────────────────────────────────
function NeonNode({
  position, phase = 0, color, size = 0.07,
}: {
  position: [number, number, number]
  phase?: number
  color: string
  size?: number
}) {
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!coreRef.current) return
    coreRef.current.scale.setScalar(0.72 + Math.sin(clock.elapsedTime * 2 + phase) * 0.28)
  })

  return (
    <group position={position}>
      {/* White-hot core — simulates the bright centre of a real neon node */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 14, 14]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={20}
          toneMapped={false}
        />
      </mesh>
      {/* Mid bloom */}
      <mesh>
        <sphereGeometry args={[size * 3, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={8}
          transparent
          opacity={0.30}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {/* Outer soft halo */}
      <mesh>
        <sphereGeometry args={[size * 7, 12, 12]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
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
  speed:  number
  offset: number
  color:  string
}) {
  const ref = useRef<THREE.Mesh>(null)
  const s   = useMemo(() => new THREE.Vector3(...start), [start])
  const e   = useMemo(() => new THREE.Vector3(...end),   [end])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (clock.elapsedTime * speed + offset) % 1
    ref.current.position.lerpVectors(s, e, t)
    ;(ref.current.material as THREE.MeshStandardMaterial).opacity = Math.sin(t * Math.PI)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 10, 10]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={22}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  )
}

// ─── Network ──────────────────────────────────────────────────────────────────
const NODES: [number, number, number][] = [
  [-2.0,  0.55,  0.0],
  [-1.0, -0.40,  0.35],
  [ 0.0,  0.65, -0.20],
  [ 1.0, -0.30,  0.40],
  [ 2.0,  0.50,  0.0],
  [-0.5,  1.45,  0.30],
  [ 0.5, -1.35, -0.20],
]

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [1, 3],
  [0, 5], [5, 2], [5, 4],
  [1, 6], [6, 3],
]

// Three vivid neon palettes — electric blue / pure cyan / hot violet
const PALETTES = [
  { coreColor: '#38bdf8', shellColor: '#0369a1' },   // electric sky-blue
  { coreColor: '#22d3ee', shellColor: '#0891b2' },   // pure cyan
  { coreColor: '#c084fc', shellColor: '#7c3aed' },   // hot violet
]

const NODE_COLORS = [
  '#38bdf8', '#22d3ee', '#38bdf8', '#c084fc',
  '#38bdf8', '#22d3ee', '#c084fc',
]

// ─── Scene ────────────────────────────────────────────────────────────────────
function NeonScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.003
    groupRef.current.rotation.x +=
      (pointer.y * 0.12 - groupRef.current.rotation.x) * 0.04
  })

  return (
    <group ref={groupRef}>
      {EDGES.map(([a, b], i) => (
        <NeonLine
          key={`l${i}`}
          start={NODES[a]}
          end={NODES[b]}
          {...PALETTES[i % PALETTES.length]}
        />
      ))}

      {EDGES.map(([a, b], i) => (
        <Packet
          key={`p${i}`}
          start={NODES[a]}
          end={NODES[b]}
          speed={0.18 + i * 0.035}
          offset={i * 0.18}
          color={PALETTES[i % PALETTES.length].coreColor}
        />
      ))}

      {NODES.map((pos, i) => (
        <NeonNode
          key={`n${i}`}
          position={pos}
          phase={i * 0.85}
          color={NODE_COLORS[i]}
          size={i === 0 || i === 4 ? 0.088 : 0.065}
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
      {/* Very low ambient — emissive does all the colour work */}
      <ambientLight intensity={0.06} />
      {/* Vivid key lights that bounce off tubes to add extra glow */}
      <pointLight position={[-3,  3,  3]} intensity={4}   color="#38bdf8" />
      <pointLight position={[ 3, -2,  2]} intensity={3.5} color="#22d3ee" />
      <pointLight position={[ 0, -3, -2]} intensity={2.5} color="#a855f7" />
      <pointLight position={[ 0,  4, -1]} intensity={2}   color="#ffffff" />
      <NeonScene />
    </Canvas>
  )
}
