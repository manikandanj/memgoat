export function RootGate() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.24, -1.2]}>
        <boxGeometry args={[5.2, 0.16, 3.8]} />
        <meshStandardMaterial color="#292927" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.9, -2.2]} castShadow>
        <torusKnotGeometry args={[0.9, 0.16, 96, 12]} />
        <meshStandardMaterial color="#7c563e" roughness={0.82} />
      </mesh>
      <mesh position={[-1.4, -0.08, -1.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 48]} />
        <meshStandardMaterial color="#141515" metalness={0.2} roughness={0.2} />
      </mesh>
      <mesh position={[1.45, 0.55, -1.9]}>
        <boxGeometry args={[0.52, 0.52, 0.04]} />
        <meshStandardMaterial color="#d8d0bd" roughness={0.5} />
      </mesh>
      <pointLight position={[0, 1.4, -0.8]} intensity={1.5} color="#d8d0bd" />
    </group>
  );
}
