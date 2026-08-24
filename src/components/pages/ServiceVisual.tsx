"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Service } from "@/content/types";
import { ease } from "@/lib/motion";

/**
 * Service scenes — abstract engineering diagrams sharing one art direction:
 * technical blueprint geometry on a dark ground (same vocabulary as the
 * process visuals). Each scene represents the mental model of one service,
 * not a literal screenshot.
 */

const W = 320;
const H = 220;

const T = { duration: 0.55, ease } as const;

function Ground() {
  const cols = [40, 80, 120, 160, 200, 240, 280];
  const rows = [40, 80, 120, 160];
  return (
    <g className="pv__ground" aria-hidden>
      {cols.map((x) => (
        <line key={`c${x}`} x1={x} y1={8} x2={x} y2={H - 8} />
      ))}
      {rows.map((y) => (
        <line key={`r${y}`} x1={8} y1={y} x2={W - 8} y2={y} />
      ))}
      <path className="pv__bracket" d="M10 26V10h16M294 10h16v16M310 194v16h-16M26 210H10v-16" />
    </g>
  );
}

function Scene({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <svg className="pv" viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false" data-scene={id}>
      <Ground />
      {children}
    </svg>
  );
}

function Bars({ reduce }: { reduce: boolean }) {
  const bars = [
    { x: 56, h: 40 },
    { x: 88, h: 72 },
    { x: 120, h: 54 },
    { x: 152, h: 96 },
    { x: 184, h: 70 },
    { x: 216, h: 112 },
  ];
  return (
    <>
      <line className="pv__dim-stroke" x1={44} y1={168} x2={268} y2={168} />
      {bars.map((b, i) => (
        <motion.rect
          key={b.x}
          className={i === 5 ? "pv__accent-fill" : "pv__fill"}
          x={b.x}
          y={168 - b.h}
          width={16}
          height={b.h}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scaleY: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scaleY: 1 }}
          transition={{ ...T, delay: 0.1 + i * 0.06 }}
          style={{ transformOrigin: `${b.x}px 168px` }}
        />
      ))}
    </>
  );
}

/** 01 Frontend Engineering — interface layers. */
function Frontend({ reduce }: { reduce: boolean }) {
  const layers = [
    { y: 46, x: 64, accent: false },
    { y: 78, x: 48, accent: false },
    { y: 110, x: 56, accent: true },
  ];
  return (
    <Scene id="frontend">
      {layers.map((l, i) => (
        <motion.g
          key={l.y}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ ...T, delay: 0.12 + i * 0.09 }}
        >
          <rect
            className={l.accent ? "pv__accent-stroke" : "pv__stroke"}
            x={l.x}
            y={l.y}
            width={200}
            height={34}
            rx={1}
          />
          <line className={l.accent ? "pv__accent-stroke" : "pv__dim-stroke"} x1={l.x + 14} y1={l.y + 11} x2={l.x + 160} y2={l.y + 11} />
          <line className={l.accent ? "pv__accent-stroke" : "pv__dim-stroke"} x1={l.x + 14} y1={l.y + 22} x2={l.x + 120} y2={l.y + 22} />
        </motion.g>
      ))}
      <motion.g
        className="pv__dim-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.4 }}
      >
        <line x1={112} y1={46} x2={112} y2={110} />
        <line x1={224} y1={46} x2={224} y2={144} />
      </motion.g>
    </Scene>
  );
}

/** 02 Angular Development — component architecture tree. */
function Angular({ reduce }: { reduce: boolean }) {
  const children = [
    { x: 72, y: 140 },
    { x: 160, y: 150 },
    { x: 248, y: 140 },
  ];
  const links = [
    "M160 78V104H72V140",
    "M160 78V150",
    "M160 78V104H248V140",
  ];
  return (
    <Scene id="angular">
      {links.map((d, i) => (
        <motion.path
          key={d}
          className={i === 1 ? "pv__accent-stroke" : "pv__stroke"}
          d={d}
          fill="none"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
          transition={{ ...T, delay: 0.14 + i * 0.07 }}
        />
      ))}
      <motion.g
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...T, delay: 0.1 }}
        style={{ transformOrigin: "160px 60px" }}
      >
        <rect className="pv__accent-stroke pv__thick" x={112} y={44} width={96} height={34} />
        <line className="pv__accent-stroke" x1={130} y1={61} x2={190} y2={61} />
      </motion.g>
      {children.map((c, i) => (
        <motion.g
          key={c.x}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ ...T, delay: 0.3 + i * 0.06 }}
        >
          <rect className={i === 1 ? "pv__accent-stroke" : "pv__stroke"} x={c.x - 26} y={c.y} width={52} height={26} />
          <line className="pv__dim-stroke" x1={c.x - 14} y1={c.y + 9} x2={c.x + 14} y2={c.y + 9} />
          <line className="pv__dim-stroke" x1={c.x - 14} y1={c.y + 17} x2={c.x + 4} y2={c.y + 17} />
        </motion.g>
      ))}
    </Scene>
  );
}

/** 03 React / Next.js — rendering architecture, server → client. */
function ReactScene({ reduce }: { reduce: boolean }) {
  return (
    <Scene id="react">
      <motion.rect
        className="pv__stroke"
        x={40}
        y={64}
        width={96}
        height={66}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
        transition={T}
      />
      <motion.rect
        className="pv__accent-stroke"
        x={184}
        y={64}
        width={96}
        height={66}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
        transition={T}
      />
      <motion.g
        className="pv__dim-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.18 }}
      >
        <rect x={54} y={82} width={68} height={12} />
        <rect x={54} y={102} width={48} height={12} />
        <rect x={198} y={82} width={68} height={12} />
        <rect x={198} y={102} width={48} height={12} />
      </motion.g>
      <motion.g
        initial={reduce ? { opacity: 0 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.28 }}
      >
        <path className="pv__accent-stroke pv__thick" d="M136 97h48M178 88l10 9-10 9" fill="none" />
        <circle className="pv__accent-fill" cx={140} cy={97} r={3} />
      </motion.g>
      <motion.g
        className="pv__dim-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.4 }}
      >
        <line x1={40} y1={146} x2={280} y2={146} />
        <line x1={40} y1={160} x2={280} y2={160} />
      </motion.g>
    </Scene>
  );
}

/** 04 UI Engineering — a token / type system. */
function Ui({ reduce }: { reduce: boolean }) {
  const swatches = [60, 92, 124, 156, 188, 220];
  return (
    <Scene id="ui">
      <motion.g
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={T}
      >
        <rect className="pv__stroke" x={60} y={56} width={200} height={22} />
        <rect className="pv__accent-fill" x={66} y={62} width={34} height={10} />
        <line className="pv__dim-stroke" x1={108} y1={64} x2={180} y2={64} />
        <line className="pv__dim-stroke" x1={108} y1={70} x2={158} y2={70} />
      </motion.g>
      {swatches.map((x, i) => (
        <motion.rect
          key={x}
          className={i === 1 ? "pv__accent-fill" : "pv__stroke"}
          x={x}
          y={110}
          width={22}
          height={22}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ ...T, delay: 0.14 + i * 0.05 }}
          style={{ transformOrigin: `${x + 11}px 121px` }}
        />
      ))}
      <motion.g
        className="pv__dim-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.42 }}
      >
        <line x1={60} y1={152} x2={252} y2={152} />
        <line x1={60} y1={166} x2={220} y2={166} />
        <line x1={60} y1={180} x2={236} y2={180} />
      </motion.g>
    </Scene>
  );
}

/** 05 Performance Optimization — measured improvement. */
function Performance({ reduce }: { reduce: boolean }) {
  return (
    <Scene id="performance">
      <Bars reduce={reduce} />
      <motion.g
        initial={reduce ? { opacity: 0 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.48 }}
      >
        <line className="pv__accent-stroke" x1={200} y1={116} x2={260} y2={116} strokeDasharray="4 3" />
        <path className="pv__accent-stroke pv__thick" d="M196 84l13 15 24-36" fill="none" />
        <circle className="pv__accent-fill" cx={200} cy={99} r={3} />
      </motion.g>
    </Scene>
  );
}

/** 06 Mobile / Ionic — responsive interface on two frames. */
function Mobile({ reduce }: { reduce: boolean }) {
  const phones = [72, 200];
  const rows = [108, 126, 144];
  return (
    <Scene id="mobile">
      {phones.map((x, i) => (
        <motion.g
          key={x}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ ...T, delay: 0.1 + i * 0.1 }}
        >
          <rect className={i === 0 ? "pv__accent-stroke" : "pv__stroke"} x={x} y={48} width={48} height={110} rx={7} />
          <line className="pv__dim-stroke" x1={x + 14} y1={60} x2={x + 34} y2={60} />
          {rows.map((r) => (
            <line key={r} className="pv__dim-stroke" x1={x + 10} y1={r} x2={x + 38} y2={r} />
          ))}
          <line className="pv__dim-stroke" x1={x + 10} y1={132} x2={x + 26} y2={132} />
        </motion.g>
      ))}
      <motion.path
        className="pv__accent-stroke pv__thick"
        d="M120 103h20m0 0l-9-9m9 9l-9 9"
        fill="none"
        initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ ...T, delay: 0.34 }}
      />
      <motion.g
        className="pv__dim-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.46 }}
      >
        <line x1={64} y1={176} x2={132} y2={176} />
        <line x1={188} y1={176} x2={256} y2={176} />
      </motion.g>
    </Scene>
  );
}

/** 07 Design Systems — component ecosystem, hub and spokes. */
function DesignSystem({ reduce }: { reduce: boolean }) {
  const satellites: Array<[number, number]> = [
    [70, 80],
    [160, 60],
    [250, 80],
    [70, 150],
    [160, 172],
    [250, 150],
  ];
  const links = [
    "M160 116L70 80",
    "M160 116L160 60",
    "M160 116L250 80",
    "M160 116L70 150",
    "M160 116L160 172",
    "M160 116L250 150",
  ];
  return (
    <Scene id="design-system">
      {links.map((d, i) => (
        <motion.path
          key={d}
          className={i === 1 ? "pv__accent-stroke" : "pv__stroke"}
          d={d}
          fill="none"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
          transition={{ ...T, delay: 0.12 + i * 0.05 }}
        />
      ))}
      <motion.g
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...T, delay: 0.1 }}
        style={{ transformOrigin: "160px 116px" }}
      >
        <circle className="pv__accent-fill" cx={160} cy={116} r={16} />
        <circle className="pv__stroke" cx={160} cy={116} r={26} />
      </motion.g>
      {satellites.map(([x, y], i) => (
        <motion.circle
          key={i}
          className={i === 1 ? "pv__accent-fill" : "pv__fill"}
          cx={x}
          cy={y}
          r={4.5}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.3 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ ...T, delay: 0.34 + i * 0.05 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
    </Scene>
  );
}

const SCENES = {
  frontend: Frontend,
  angular: Angular,
  react: ReactScene,
  ui: Ui,
  performance: Performance,
  ionic: Mobile,
  "design-systems": DesignSystem,
} as const;

type ServiceVisualId = Service["id"];

export function ServiceVisual({ id, reduce = false }: { id: ServiceVisualId; reduce?: boolean }) {
  const Component = SCENES[id as keyof typeof SCENES];
  if (!Component) return null;
  return <Component reduce={reduce} />;
}

export function ServiceMediaVisual({ service, reduce = false }: { service: Service; reduce?: boolean }) {
  const media = service.media;
  if (!media) {
    return <ServiceVisual id={service.id} reduce={reduce} />;
  }

  if (media.type === "video") {
    return (
      <div className="svc-media-frame">
        <video
          src={media.src}
          poster={media.poster}
          autoPlay={!reduce}
          loop
          muted
          playsInline
          /* The poster carries the frame until playback starts, so there is
             nothing to gain from buffering ahead of it. With reduced motion
             the clip never plays at all and must not be fetched. */
          preload={reduce ? "none" : "metadata"}
          disablePictureInPicture
          aria-label={media.alt}
          className="svc-media-element"
        />
        <div className="svc-media-badge mono">VIDEO</div>
      </div>
    );
  }

  if (media.type === "gif") {
    return (
      <div className="svc-media-frame">
        {/*
          next/image would re-encode an animated GIF down to its first frame,
          so this one stays a plain <img>. The frame is already sized, so the
          missing intrinsic dimensions cost no layout shift.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          decoding="async"
          className="svc-media-element"
        />
        <div className="svc-media-badge mono">GIF</div>
      </div>
    );
  }

  return (
    <div className="svc-media-frame">
      {/* Below the fold — served as AVIF/WebP at the right width, never eager. */}
      <Image
        src={media.src}
        alt={media.alt}
        fill
        loading="lazy"
        sizes="(max-width: 960px) 100vw, 50vw"
        className="svc-media-element"
        style={{ objectFit: "cover" }}
      />
      <div className="svc-media-badge mono">IMAGE</div>
    </div>
  );
}