import { CheckCircle2, Eye, MapPin, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import type { HotspotSummary, Room } from "../api/types";
import { useGameStore } from "../state/gameStore";

interface Props {
  room: Room | null;
}

interface HotspotLayout {
  x: number;
  y: number;
  align?: "left" | "right";
}

const sceneMeta: Record<string, { eyebrow: string; mood: string }> = {
  "waking-chamber": {
    eyebrow: "Cave Echo",
    mood: "A sealed limestone room, cold enough to hold one last useful memory."
  },
  "bell-gallery": {
    eyebrow: "Bronze Gallery",
    mood: "Root-hung bells listen for a name the goat keeps forgetting."
  },
  "root-gate": {
    eyebrow: "Final Threshold",
    mood: "Black water, tangled roots, and a clean mark that wants to be believed."
  }
};

const hotspotLayouts: Record<string, HotspotLayout> = {
  locket: { x: 26, y: 66 },
  dead_lantern: { x: 50, y: 61 },
  scratched_wall: { x: 75, y: 44, align: "right" },
  echo_bell: { x: 29, y: 36 },
  ring_of_names: { x: 51, y: 70 },
  lantern_hook: { x: 73, y: 38, align: "right" },
  root_gate: { x: 51, y: 32 },
  mirror_pool: { x: 31, y: 72 },
  witch_mark: { x: 74, y: 54, align: "right" }
};

function fallbackLayout(hotspot: HotspotSummary): HotspotLayout {
  const [x, y] = hotspot.position;
  return {
    x: Math.max(16, Math.min(84, 50 + x * 16)),
    y: Math.max(20, Math.min(78, 64 - y * 28)),
    align: x > 0 ? "right" : "left"
  };
}

function WakingChamberArt() {
  return (
    <svg className="scene-art" viewBox="0 0 1200 720" role="img" aria-label="Illustrated waking chamber">
      <defs>
        <radialGradient id="wakeGlow" cx="50%" cy="55%" r="58%">
          <stop offset="0%" stopColor="#53635b" />
          <stop offset="47%" stopColor="#25312d" />
          <stop offset="100%" stopColor="#0a1110" />
        </radialGradient>
        <linearGradient id="wakeFloor" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b4741" />
          <stop offset="65%" stopColor="#171f1c" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#010403" floodOpacity="0.45" />
        </filter>
      </defs>
      <rect width="1200" height="720" fill="url(#wakeGlow)" />
      <path d="M82 540 L252 235 L942 235 L1124 548 L876 690 L310 690 Z" fill="url(#wakeFloor)" />
      <path d="M128 0 L258 238 L84 540 L0 584 L0 0 Z" fill="#0d1715" opacity="0.92" />
      <path d="M1070 0 L942 236 L1124 548 L1200 590 L1200 0 Z" fill="#0b1312" opacity="0.94" />
      <path d="M258 238 C372 188 812 190 942 236 L884 270 C724 236 470 238 316 272 Z" fill="#66736a" opacity="0.13" />
      <path d="M402 270 C448 238 762 238 812 270 L784 604 C714 626 500 626 424 604 Z" fill="#111917" opacity="0.36" />
      <ellipse cx="604" cy="643" rx="294" ry="46" fill="#080d0c" opacity="0.48" />
      <g filter="url(#softShadow)">
        <ellipse cx="316" cy="550" rx="78" ry="26" fill="#9f7b37" />
        <ellipse cx="316" cy="537" rx="50" ry="52" fill="#c7cbc1" />
        <ellipse cx="316" cy="552" rx="82" ry="10" fill="#d1a34e" />
        <path d="M277 549 C300 566 342 566 366 549" fill="none" stroke="#6a4b1f" strokeWidth="8" strokeLinecap="round" />
      </g>
      <g filter="url(#softShadow)">
        <path d="M560 308 L639 308 L666 574 C632 594 561 594 528 574 Z" fill="#161815" />
        <path d="M577 324 L622 324 L638 548 C620 562 580 562 562 548 Z" fill="#20231d" />
        <path d="M578 322 C586 296 614 296 622 322" fill="none" stroke="#876832" strokeWidth="8" strokeLinecap="round" />
      </g>
      <g>
        <path d="M846 318 C892 306 939 309 982 326" fill="none" stroke="#d0bd7a" strokeWidth="7" strokeLinecap="round" />
        <path d="M858 352 C904 341 936 344 970 356" fill="none" stroke="#d0bd7a" strokeWidth="6" strokeLinecap="round" />
        <path d="M870 386 C910 377 934 380 958 390" fill="none" stroke="#d0bd7a" strokeWidth="5" strokeLinecap="round" />
        <path d="M790 416 C850 378 896 371 990 406" fill="none" stroke="#f2ead2" strokeWidth="3" opacity="0.25" />
      </g>
      <g opacity="0.55">
        <circle cx="170" cy="145" r="2" fill="#d5cda9" />
        <circle cx="222" cy="210" r="2" fill="#d5cda9" />
        <circle cx="1005" cy="162" r="2" fill="#d5cda9" />
        <circle cx="1048" cy="250" r="2" fill="#d5cda9" />
      </g>
    </svg>
  );
}

function BellGalleryArt() {
  return (
    <svg className="scene-art" viewBox="0 0 1200 720" role="img" aria-label="Illustrated bell gallery">
      <defs>
        <radialGradient id="bellGlow" cx="51%" cy="48%" r="65%">
          <stop offset="0%" stopColor="#5b6254" />
          <stop offset="46%" stopColor="#202b2b" />
          <stop offset="100%" stopColor="#080e10" />
        </radialGradient>
        <linearGradient id="bronze" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f0c16d" />
          <stop offset="43%" stopColor="#9a6430" />
          <stop offset="100%" stopColor="#3e2818" />
        </linearGradient>
      </defs>
      <rect width="1200" height="720" fill="url(#bellGlow)" />
      <path d="M0 112 C185 70 328 94 468 132 C670 188 846 148 1200 76 L1200 0 L0 0 Z" fill="#111817" />
      <path d="M0 535 C257 476 872 476 1200 540 L1200 720 L0 720 Z" fill="#111918" />
      <path d="M153 540 C300 486 898 488 1042 540 L910 659 L288 659 Z" fill="#29342f" />
      <path d="M246 168 C320 226 338 332 300 442" fill="none" stroke="#513525" strokeWidth="18" strokeLinecap="round" />
      <path d="M969 104 C874 220 860 349 925 466" fill="none" stroke="#4a3325" strokeWidth="20" strokeLinecap="round" />
      <path d="M225 0 C224 90 221 144 192 218" fill="none" stroke="#60402a" strokeWidth="15" />
      <path d="M590 0 C580 105 588 174 644 232" fill="none" stroke="#553725" strokeWidth="14" />
      <path d="M936 0 C948 96 924 170 876 236" fill="none" stroke="#60402a" strokeWidth="15" />
      <g>
        <path d="M242 214 C210 252 199 310 219 350 L347 350 C367 310 356 252 324 214 Z" fill="url(#bronze)" />
        <ellipse cx="283" cy="350" rx="72" ry="19" fill="#d99e45" />
        <circle cx="283" cy="380" r="10" fill="#f2d28a" />
      </g>
      <g opacity="0.86">
        <path d="M825 206 C794 242 783 295 800 333 L918 333 C935 295 924 242 893 206 Z" fill="url(#bronze)" />
        <ellipse cx="859" cy="333" rx="66" ry="17" fill="#c88f3f" />
        <circle cx="859" cy="360" r="9" fill="#f2d28a" />
      </g>
      <g>
        <ellipse cx="606" cy="548" rx="238" ry="74" fill="#151d1b" stroke="#9e8d5d" strokeWidth="3" opacity="0.92" />
        <ellipse cx="606" cy="548" rx="174" ry="48" fill="none" stroke="#d4bd72" strokeWidth="4" strokeDasharray="16 17" />
        <path d="M438 548 C510 511 699 510 772 548 C700 586 510 586 438 548 Z" fill="#26312d" opacity="0.72" />
      </g>
      <path d="M844 272 L882 246 L907 258 L890 282 L908 306 L876 306 L858 335 L846 303 L813 291 Z" fill="#a5d4bf" opacity="0.22" />
      <path d="M120 438 C206 413 272 417 354 446" fill="none" stroke="#c5b375" strokeWidth="2" opacity="0.24" />
    </svg>
  );
}

function RootGateArt() {
  return (
    <svg className="scene-art" viewBox="0 0 1200 720" role="img" aria-label="Illustrated root gate">
      <defs>
        <radialGradient id="rootGlow" cx="51%" cy="43%" r="64%">
          <stop offset="0%" stopColor="#5b5048" />
          <stop offset="44%" stopColor="#20231f" />
          <stop offset="100%" stopColor="#080c0c" />
        </radialGradient>
        <linearGradient id="pool" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#516b70" />
          <stop offset="55%" stopColor="#101618" />
          <stop offset="100%" stopColor="#020405" />
        </linearGradient>
      </defs>
      <rect width="1200" height="720" fill="url(#rootGlow)" />
      <path d="M0 548 C240 494 901 494 1200 552 L1200 720 L0 720 Z" fill="#111716" />
      <path d="M282 614 C422 574 772 572 918 614 L834 686 L366 686 Z" fill="#252923" />
      <g>
        <path d="M468 472 C436 356 458 205 598 116 C746 205 770 356 731 472" fill="none" stroke="#6a4632" strokeWidth="30" strokeLinecap="round" />
        <path d="M397 494 C434 340 500 213 604 83" fill="none" stroke="#4b3124" strokeWidth="24" strokeLinecap="round" />
        <path d="M798 497 C756 337 704 210 603 83" fill="none" stroke="#4d3325" strokeWidth="24" strokeLinecap="round" />
        <path d="M514 480 C512 341 544 220 600 126 C656 220 689 341 684 480" fill="none" stroke="#2d211b" strokeWidth="22" strokeLinecap="round" />
        <path d="M440 482 C513 435 687 435 760 482" fill="none" stroke="#7a543c" strokeWidth="22" strokeLinecap="round" />
        <path d="M474 410 C540 375 660 375 727 410" fill="none" stroke="#39281f" strokeWidth="16" strokeLinecap="round" />
      </g>
      <path d="M506 244 C552 196 646 196 692 244 L686 461 C640 486 557 486 511 461 Z" fill="#060909" opacity="0.72" />
      <path d="M508 245 C551 205 647 205 690 245" fill="none" stroke="#d6bd76" strokeWidth="4" opacity="0.38" />
      <g>
        <ellipse cx="356" cy="568" rx="150" ry="52" fill="url(#pool)" />
        <ellipse cx="356" cy="560" rx="112" ry="28" fill="#789199" opacity="0.2" />
        <path d="M267 560 C315 543 397 543 445 560" fill="none" stroke="#d7ece8" strokeWidth="3" opacity="0.28" />
      </g>
      <g>
        <path d="M831 351 L883 378 L866 434 L806 434 L789 378 Z" fill="#efe6cc" opacity="0.62" />
        <path d="M814 386 L861 400" stroke="#2e2521" strokeWidth="8" strokeLinecap="round" />
        <path d="M848 366 L825 425" stroke="#2e2521" strokeWidth="7" strokeLinecap="round" />
        <path d="M789 453 C824 439 856 439 893 453" fill="none" stroke="#e4d6b1" strokeWidth="4" opacity="0.28" />
      </g>
      <circle cx="599" cy="126" r="7" fill="#f5d887" opacity="0.9" />
      <circle cx="356" cy="560" r="4" fill="#b7e5de" opacity="0.8" />
    </svg>
  );
}

function SceneArt({ roomId }: { roomId: string }) {
  if (roomId === "bell-gallery") return <BellGalleryArt />;
  if (roomId === "root-gate") return <RootGateArt />;
  return <WakingChamberArt />;
}

function kindLabel(kind: string) {
  return kind.replace(/-/g, " ");
}

export function CaveDiorama({ room }: Props) {
  const inspect = useGameStore((state) => state.inspect);
  const meta = room ? sceneMeta[room.id] ?? sceneMeta["waking-chamber"] : sceneMeta["waking-chamber"];

  return (
    <section className={`cave-zone ${room ? `scene-${room.id}` : ""}`} aria-label="Illustrated cave scene">
      <div className="scene-frame">
        {room ? (
          <>
            <SceneArt roomId={room.id} />
            <div className="scene-vignette" aria-hidden />
            <header className="scene-title">
              <span>{meta.eyebrow}</span>
              <h2>{room.title}</h2>
              <p>{meta.mood}</p>
            </header>
            <div className="scene-hotspots" aria-label="Inspectable objects">
              {room.hotspots.map((hotspot) => {
                const layout = hotspotLayouts[hotspot.id] ?? fallbackLayout(hotspot);
                const style = { "--hotspot-x": `${layout.x}%`, "--hotspot-y": `${layout.y}%` } as CSSProperties;
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    className={`scene-hotspot ${hotspot.examined ? "examined" : ""} ${layout.align === "right" ? "align-right" : ""}`}
                    style={style}
                    onClick={() => void inspect(hotspot.id)}
                    aria-label={`Inspect ${hotspot.label}`}
                  >
                    <span className="hotspot-marker" aria-hidden>
                      {hotspot.examined ? <CheckCircle2 size={18} /> : <Eye size={18} />}
                    </span>
                    <span className="hotspot-card">
                      <strong>{hotspot.label}</strong>
                      <small>{hotspot.examined ? "examined" : kindLabel(hotspot.kind)}</small>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="scene-inventory" aria-label="Accessible cave objects">
              {room.hotspots.map((hotspot) => (
                <button key={hotspot.id} type="button" className={hotspot.examined ? "examined" : ""} onClick={() => void inspect(hotspot.id)}>
                  <MapPin size={16} aria-hidden />
                  <span>{hotspot.label}</span>
                  <small>{hotspot.examined ? "examined" : kindLabel(hotspot.kind)}</small>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="loading-cave">
            <Sparkles size={22} aria-hidden />
            Opening cave...
          </div>
        )}
      </div>
    </section>
  );
}
