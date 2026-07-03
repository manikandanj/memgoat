export function BellGallery() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.22, -1.2]}>
        <cylinderGeometry args={[2.8, 2.2, 0.2, 48]} />
        <meshStandardMaterial color="#24302f" roughness={0.86} />
      </mesh>
      {[-1.4, 0, 1.4].map((x, index) => (
        <mesh key={x} position={[x, 1.25 + index * 0.08, -1.5]} castShadow>
          <coneGeometry args={[0.34, 0.72, 32]} />
          <meshStandardMaterial color="#a76f3f" metalness={0.55} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 0.03, -1.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.035, 12, 96]} />
        <meshStandardMaterial color="#cbbd91" roughness={0.6} />
      </mesh>
      <pointLight position={[0, 1.2, -1]} intensity={1.4} color="#9cc7bf" />
    </group>
  );
}
