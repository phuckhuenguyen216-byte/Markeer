"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { motion } from "framer-motion";

const B = "/img/mascot_t";

const A = {
  body: `${B}/body.webp`,
  belt: `${B}/belt.webp`,
  heart: `${B}/heard.webp`,
  armIdleLeft: `${B}/arm_idle_left.webp`,
  armIdleRight: `${B}/arm_idle_right.webp`,
  armOfferLeft: `${B}/arm_offer_left.webp`,
  armRaiseLeft: `${B}/arm_raise_left.webp`,
  armWave: `${B}/arm_wave.webp`,
  armWaveRight: `${B}/arm_wave_right.webp`,
  armPoint: `${B}/arm_point.webp`,
  armPhone: `${B}/arm_phone.webp`,
  armRaiseRight: `${B}/arm_raise_right.webp`,
  eyesIdle: `${B}/eyes_idle.webp`,
  eyesBlink: `${B}/eyes_blink.webp`,
  eyesHappy: `${B}/eyes_happy.webp`,
  eyesFocused: `${B}/eyes_focused.webp`,
  eyesSurprised: `${B}/eyes_surprised.webp`,
  mouthSmile: `${B}/mouth_smile.webp`,
  mouthOpen: `${B}/mouth_open.webp`,
} as const;

export type MascotState =
  | "idle"
  | "greeting"
  | "guide"
  | "thinking"
  | "success"
  | "warning"
  | "focused"
  | "listening"
  | "presenting"
  | "contact"
  | "encourage"
  | "celebrate";

type LeftArm = "idle" | "offer" | "raise";
type RightArm = "idle" | "wave" | "waveRight" | "point" | "phone" | "raise";
type PoseMotion =
  | "idle"
  | "wave"
  | "point"
  | "thinking"
  | "warning"
  | "celebrate";

interface StateConfig {
  eyes: string;
  mouth: string;
  leftArm?: LeftArm;
  rightArm?: RightArm;
  blink?: boolean;
  blush?: boolean;
  motion?: PoseMotion;
}

const SM: Record<MascotState, StateConfig> = {
  idle: {
    eyes: A.eyesIdle,
    mouth: A.mouthSmile,
    leftArm: "idle",
    rightArm: "idle",
    blink: true,
  },
  greeting: {
    eyes: A.eyesIdle,
    mouth: A.mouthSmile,
    leftArm: "idle",
    rightArm: "wave",
    blink: true,
    motion: "wave",
  },
  guide: {
    eyes: A.eyesIdle,
    mouth: A.mouthSmile,
    leftArm: "idle",
    rightArm: "point",
    blink: true,
    motion: "point",
  },
  thinking: {
    eyes: A.eyesFocused,
    mouth: A.mouthOpen,
    leftArm: "idle",
    rightArm: "idle",
    motion: "thinking",
  },
  success: {
    eyes: A.eyesIdle,
    mouth: A.mouthSmile,
    leftArm: "offer",
    rightArm: "idle",
    blink: true,
    blush: true,
  },
  warning: {
    eyes: A.eyesSurprised,
    mouth: A.mouthOpen,
    leftArm: "idle",
    rightArm: "raise",
    motion: "warning",
  },
  focused: {
    eyes: A.eyesFocused,
    mouth: A.mouthSmile,
    leftArm: "idle",
    rightArm: "idle",
  },
  listening: {
    eyes: A.eyesFocused,
    mouth: A.mouthSmile,
    leftArm: "idle",
    rightArm: "idle",
  },
  presenting: {
    eyes: A.eyesIdle,
    mouth: A.mouthSmile,
    leftArm: "idle",
    rightArm: "point",
    blink: true,
    motion: "point",
  },
  contact: {
    eyes: A.eyesIdle,
    mouth: A.mouthSmile,
    leftArm: "idle",
    rightArm: "phone",
    blink: true,
  },
  encourage: {
    eyes: A.eyesIdle,
    mouth: A.mouthSmile,
    leftArm: "offer",
    rightArm: "idle",
    blink: true,
    blush: true,
  },
  celebrate: {
    eyes: A.eyesIdle,
    mouth: A.mouthSmile,
    leftArm: "raise",
    rightArm: "raise",
    blink: true,
    blush: true,
    motion: "celebrate",
  },
};

const LEFT_ARM: Record<LeftArm, string> = {
  idle: A.armIdleLeft,
  offer: A.armOfferLeft,
  raise: A.armRaiseLeft,
};

const RIGHT_ARM: Record<RightArm, string> = {
  idle: A.armIdleRight,
  wave: A.armWave,
  waveRight: A.armWaveRight,
  point: A.armPoint,
  phone: A.armPhone,
  raise: A.armRaiseRight,
};

const layerCss: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "block",
  pointerEvents: "none",
};

function L({ src }: { src: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" draggable={false} style={layerCss} />;
}

interface MascotProps {
  state?: MascotState;
  size?: number;
  className?: string;
  interactive?: boolean;
  hoverState?: MascotState;
}

function getHoverState(state: MascotState): MascotState {
  if (state === "warning") return "encourage";
  if (state === "contact") return "greeting";
  if (state === "thinking" || state === "focused") return "listening";
  if (state === "guide" || state === "presenting") return "encourage";
  if (state === "success" || state === "encourage") return "celebrate";
  return "greeting";
}

export default function Mascot({
  state = "idle",
  size = 120,
  className = "",
  interactive = false,
  hoverState,
}: MascotProps) {
  const [blink, setBlink] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const activeState =
    interactive && isHovering ? (hoverState ?? getHoverState(state)) : state;
  const c = SM[activeState];

  useEffect(() => {
    if (!c.blink) return;
    let t: ReturnType<typeof setTimeout>;
    const go = () => {
      t = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => {
            setBlink(false);
            go();
          }, 150);
        },
        3000 + Math.random() * 2000,
      );
    };
    go();
    return () => clearTimeout(t);
  }, [c.blink]);

  const fp = Math.max(2, size * 0.02);
  const a0: CSSProperties = { position: "absolute", inset: 0 };
  const eye = c.blink ? (blink ? A.eyesBlink : c.eyes) : c.eyes;
  const leftArm = c.leftArm ?? "idle";
  const rightArm = c.rightArm ?? "idle";
  const waveRight = rightArm === "wave" || rightArm === "waveRight";
  const leftGestureOnTop = leftArm !== "idle";
  const bodyAnimate =
    c.motion === "warning"
      ? { y: [0, -fp, 0], x: [0, -1.4, 1.4, 0] }
      : c.motion === "celebrate"
        ? { y: [0, -fp * 1.8, 0], rotate: [0, -1.2, 1.2, 0] }
        : { y: [0, -fp, 0] };

  return (
    <motion.div
      className={className}
      aria-hidden="true"
      onHoverStart={interactive ? () => setIsHovering(true) : undefined}
      onHoverEnd={interactive ? () => setIsHovering(false) : undefined}
      whileHover={
        interactive ? { scale: 1.045, rotate: activeState === "celebrate" ? 1.5 : -1 } : undefined
      }
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        cursor: interactive ? "pointer" : undefined,
        pointerEvents: interactive ? "auto" : undefined,
      }}
    >
      <motion.div
        style={a0}
        animate={bodyAnimate}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <L src={A.body} />
        {!leftGestureOnTop && <L src={LEFT_ARM[leftArm]} />}
        {!waveRight && <L src={RIGHT_ARM[rightArm]} />}
        {waveRight && (
          <motion.div
            key={rightArm}
            style={{ ...a0, transformOrigin: "72% 48%" }}
            animate={{ rotate: [0, -10, 4, -8, 2, -5, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
            }}
          >
            <L src={RIGHT_ARM[rightArm]} />
          </motion.div>
        )}
        <L src={A.belt} />
        {leftGestureOnTop && leftArm === "raise" ? (
          <motion.div
            key="left-raise"
            style={{ ...a0, transformOrigin: "18% 48%" }}
            animate={{ rotate: [0, 3, -2, 2, 0] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              repeatDelay: 0.8,
              ease: "easeInOut",
            }}
          >
            <L src={LEFT_ARM[leftArm]} />
          </motion.div>
        ) : null}
        {leftGestureOnTop && leftArm !== "raise" ? (
          <L src={LEFT_ARM[leftArm]} />
        ) : null}
        <L src={eye} />
        {c.blush && (
          <>
            <motion.span
              style={{
                position: "absolute",
                left: "32.5%",
                top: "40.5%",
                width: "7.2%",
                height: "3.8%",
                borderRadius: "999px",
                background:
                  "radial-gradient(ellipse, rgba(248,113,113,.52), rgba(248,113,113,0))",
                pointerEvents: "none",
              }}
              animate={{ opacity: [0.55, 0.9, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              style={{
                position: "absolute",
                left: "59.5%",
                top: "40.5%",
                width: "7.2%",
                height: "3.8%",
                borderRadius: "999px",
                background:
                  "radial-gradient(ellipse, rgba(248,113,113,.52), rgba(248,113,113,0))",
                pointerEvents: "none",
              }}
              animate={{ opacity: [0.55, 0.9, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        <L src={c.mouth} />
        <L src={A.heart} />
      </motion.div>
    </motion.div>
  );
}
