export function WakingChamber() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.22, -1.2]}>
        <boxGeometry args={[5.2, 0.18, 3.8]} />
        <meshStandardMaterial color="#263330" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.15, -2.45]}>
        <boxGeometry args={[5.4, 2.7, 0.18]} />
        <meshStandardMaterial color="#34413f" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.22, -1.45]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.55, 24]} />
        <meshStandardMaterial color="#28241f" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[-1.8, 0.05, -1.2]} castShadow rotation={[1.2, 0.1, -0.2]}>
        <torusGeometry args={[0.28, 0.04, 12, 32]} />
        <meshStandardMaterial color="#d0a85d" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}
