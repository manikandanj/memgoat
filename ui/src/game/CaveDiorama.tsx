import { Environment, Float, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { Room } from "../api/types";
import { useGameStore } from "../state/gameStore";
import { BellGallery } from "./chambers/BellGallery";
import { RootGate } from "./chambers/RootGate";
import { WakingChamber } from "./chambers/WakingChamber";
import { hotspotColor } from "./hotspots";

interface Props {
  room: Room | null;
}

function Chamber({ room }: { room: Room }) {
  if (room.id === "bell-gallery") return <BellGallery />;
  if (room.id === "root-gate") return <RootGate />;
  return <WakingChamber />;
}

function HotspotMeshes({ room }: { room: Room }) {
  const inspect = useGameStore((state) => state.inspect);
  return (
    <>
      {room.hotspots.map((hotspot) => (
        <Float key={hotspot.id} speed={1.6} rotationIntensity={0.1} floatIntensity={0.16}>
          <mesh
            position={hotspot.position}
            onClick={(event) => {
              event.stopPropagation();
              void inspect(hotspot.id);
            }}
          >
            <sphereGeometry args={[hotspot.examined ? 0.13 : 0.17, 24, 24]} />
            <meshStandardMaterial color={hotspotColor(hotspot)} emissive={hotspot.examined ? "#244035" : "#2d2817"} emissiveIntensity={0.45} />
            <Html distanceFactor={8} position={[0, 0.32, 0]} center>
              <span className="hotspot-label">{hotspot.label}</span>
            </Html>
          </mesh>
        </Float>
      ))}
    </>
  );
}

export function CaveDiorama({ room }: Props) {
  const inspect = useGameStore((state) => state.inspect);

  return (
    <section className="cave-zone" aria-label="Cave diorama">
      <div className="cave-canvas">
        {room ? (
          <Canvas shadows dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 1.4, 4.2]} fov={48} />
              <fog attach="fog" args={["#111816", 3, 8]} />
              <ambientLight intensity={0.35} />
              <pointLight position={[0, 2.5, 2]} intensity={2.1} color="#f3dfb0" castShadow />
              <Chamber room={room} />
              <HotspotMeshes room={room} />
              <Environment preset="warehouse" />
              <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.05} maxPolarAngle={1.55} minAzimuthAngle={-0.45} maxAzimuthAngle={0.45} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="loading-cave">Opening cave...</div>
        )}
      </div>
      {room && (
        <div className="hotspot-controls" aria-label="Accessible cave objects">
          {room.hotspots.map((hotspot) => (
            <button key={hotspot.id} type="button" className={hotspot.examined ? "examined" : ""} onClick={() => void inspect(hotspot.id)}>
              <span>{hotspot.label}</span>
              <small>{hotspot.examined ? "examined" : hotspot.kind}</small>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
