"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { MascotState } from "@/app/components/Mascot";

const B = "/img/mascot_guide";

const SPRITE: Record<MascotState, string> = {
  idle: `${B}/idle.png`,
  greeting: `${B}/greeting.png`,
  guide: `${B}/presenting.png`,
  thinking: `${B}/thinking.png`,
  success: `${B}/celebrate.png`,
  warning: `${B}/warning.png`,
  focused: `${B}/presenting.png`,
  listening: `${B}/idle.png`,
  presenting: `${B}/presenting.png`,
  contact: `${B}/contact.png`,
  encourage: `${B}/greeting.png`,
  celebrate: `${B}/celebrate.png`,
};

const SPRITE_SCALE: Record<MascotState, number> = {
  idle: 1.03,
  greeting: 1.34,
  guide: 1.27,
  thinking: 0.98,
  success: 1.17,
  warning: 1.16,
  focused: 1.27,
  listening: 1.03,
  presenting: 1.27,
  contact: 1.11,
  encourage: 1.34,
  celebrate: 1.17,
};

interface AnchorBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface FaceAnchor {
  leftEye: AnchorBox;
  rightEye: AnchorBox;
  mouth: AnchorBox;
}

const ANCHOR: Record<MascotState, FaceAnchor> = {
  idle: {
    leftEye: { x: 159, y: 139, w: 40, h: 56 },
    rightEye: { x: 274, y: 145, w: 40, h: 55 },
    mouth: { x: 217, y: 200, w: 37, h: 13 },
  },
  greeting: {
    leftEye: { x: 232, y: 163, w: 32, h: 43 },
    rightEye: { x: 315, y: 170, w: 31, h: 42 },
    mouth: { x: 273, y: 209, w: 29, h: 13 },
  },
  guide: {
    leftEye: { x: 195, y: 163, w: 33, h: 45 },
    rightEye: { x: 282, y: 161, w: 32, h: 44 },
    mouth: { x: 241, y: 208, w: 30, h: 10 },
  },
  thinking: {
    leftEye: { x: 127, y: 129, w: 40, h: 57 },
    rightEye: { x: 233, y: 140, w: 42, h: 58 },
    mouth: { x: 177, y: 193, w: 36, h: 13 },
  },
  success: {
    leftEye: { x: 190, y: 150, w: 35, h: 48 },
    rightEye: { x: 283, y: 151, w: 35, h: 48 },
    mouth: { x: 237, y: 198, w: 34, h: 15 },
  },
  warning: {
    leftEye: { x: 190, y: 150, w: 35, h: 49 },
    rightEye: { x: 284, y: 152, w: 36, h: 48 },
    mouth: { x: 245, y: 199, w: 20, h: 17 },
  },
  focused: {
    leftEye: { x: 195, y: 163, w: 33, h: 45 },
    rightEye: { x: 282, y: 161, w: 32, h: 44 },
    mouth: { x: 241, y: 208, w: 30, h: 10 },
  },
  listening: {
    leftEye: { x: 159, y: 139, w: 40, h: 56 },
    rightEye: { x: 274, y: 145, w: 40, h: 55 },
    mouth: { x: 217, y: 200, w: 37, h: 13 },
  },
  presenting: {
    leftEye: { x: 195, y: 163, w: 33, h: 45 },
    rightEye: { x: 282, y: 161, w: 32, h: 44 },
    mouth: { x: 241, y: 208, w: 30, h: 10 },
  },
  contact: {
    leftEye: { x: 175, y: 149, w: 37, h: 51 },
    rightEye: { x: 275, y: 153, w: 37, h: 51 },
    mouth: { x: 225, y: 201, w: 36, h: 16 },
  },
  encourage: {
    leftEye: { x: 232, y: 163, w: 32, h: 43 },
    rightEye: { x: 315, y: 170, w: 31, h: 42 },
    mouth: { x: 273, y: 209, w: 29, h: 13 },
  },
  celebrate: {
    leftEye: { x: 190, y: 150, w: 35, h: 48 },
    rightEye: { x: 283, y: 151, w: 35, h: 48 },
    mouth: { x: 237, y: 198, w: 34, h: 15 },
  },
};

interface MascotGuideProps {
  state?: MascotState;
  size?: number;
  className?: string;
  interactive?: boolean;
  hoverState?: MascotState;
  flipX?: boolean;
}

function getHoverState(state: MascotState): MascotState {
  if (state === "warning") return "encourage";
  if (state === "contact") return "greeting";
  if (state === "thinking" || state === "focused") return "listening";
  if (state === "guide" || state === "presenting") return "encourage";
  if (state === "success" || state === "encourage") return "celebrate";
  return "greeting";
}

function getFaceConfig(state: MascotState) {
  if (state === "thinking") return { mode: "soft", mouth: "quiet" };
  if (state === "warning") return { mode: "alert", mouth: "pop" };
  if (state === "contact") return { mode: "talking", mouth: "talk" };
  if (state === "presenting" || state === "guide" || state === "focused") {
    return { mode: "talking", mouth: "talk" };
  }
  if (state === "greeting") return { mode: "talking", mouth: "talk" };
  if (state === "success" || state === "celebrate" || state === "encourage") {
    return { mode: "happy", mouth: "pop" };
  }
  return { mode: "idle", mouth: "quiet" };
}

function pct(value: number) {
  return `${(value / 512) * 100}%`;
}

export default function MascotGuide({
  state = "idle",
  size = 120,
  className = "",
  interactive = false,
  hoverState,
  flipX = false,
}: MascotGuideProps) {
  const [isHovering, setIsHovering] = useState(false);
  const activeState =
    interactive && isHovering ? (hoverState ?? getHoverState(state)) : state;
  const src = SPRITE[activeState] ?? SPRITE.idle;
  const face = getFaceConfig(activeState);
  const anchor = ANCHOR[activeState] ?? ANCHOR.idle;
  const spriteScale = SPRITE_SCALE[activeState] ?? 1.08;
  const float = Math.max(2, size * 0.018);
  const isWarning = activeState === "warning";
  const isCelebrate =
    activeState === "success" ||
    activeState === "encourage" ||
    activeState === "celebrate";

  return (
    <motion.div
      className={`mg-root ${className}`}
      aria-hidden="true"
      onHoverStart={interactive ? () => setIsHovering(true) : undefined}
      onHoverEnd={interactive ? () => setIsHovering(false) : undefined}
      whileHover={interactive ? { scale: 1.045, rotate: -1 } : undefined}
      animate={
        isWarning
          ? { y: [0, -float, 0], x: [0, -1.4, 1.4, 0] }
          : isCelebrate
            ? { y: [0, -float * 1.7, 0], rotate: [0, -1.4, 1.4, 0] }
            : { y: [0, -float, 0] }
      }
      transition={{
        duration: isWarning ? 2.2 : 3.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={
        {
          "--mg-size": `${size}px`,
          "--mg-sprite-scale": spriteScale,
          "--mg-flip-x": flipX ? -1 : 1,
          "--mg-le-x": pct(anchor.leftEye.x - 1),
          "--mg-le-y": pct(anchor.leftEye.y - 1),
          "--mg-le-w": pct(anchor.leftEye.w + 2),
          "--mg-le-h": pct(anchor.leftEye.h + 3),
          "--mg-re-x": pct(anchor.rightEye.x - 1),
          "--mg-re-y": pct(anchor.rightEye.y - 1),
          "--mg-re-w": pct(anchor.rightEye.w + 2),
          "--mg-re-h": pct(anchor.rightEye.h + 3),
          "--mg-mouth-x": pct(anchor.mouth.x - 4),
          "--mg-mouth-y": pct(anchor.mouth.y - 1),
          "--mg-mouth-w": pct(anchor.mouth.w + 8),
          "--mg-mouth-h": pct(anchor.mouth.h + 8),
        } as CSSProperties
      }
    >
      <style>{css}</style>
      <div className="mg-sprite">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mg-body" src={src} alt="" draggable={false} />
        <div className={`mg-face ${face.mode}`}>
          <span className="mg-lid mg-lid-left" />
          <span className="mg-lid mg-lid-right" />
          <span className={`mg-mouth-live ${face.mouth}`} />
        </div>
      </div>
    </motion.div>
  );
}

const css = `
.mg-root{position:relative;width:var(--mg-size);height:var(--mg-size);flex-shrink:0;cursor:inherit;pointer-events:auto;overflow:visible}
.mg-sprite{position:absolute;inset:0;transform:scaleX(var(--mg-flip-x)) scale(var(--mg-sprite-scale));transform-origin:50% 50%;pointer-events:none}
.mg-body{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;user-select:none}
.mg-face{position:absolute;inset:0;pointer-events:none}
.mg-lid{position:absolute;border-radius:999px;background:linear-gradient(180deg,#f8dfb9 0%,#f1d1a2 100%);opacity:0;transform:scaleY(.04);transform-origin:50% 0;box-shadow:0 1px 3px rgba(120,70,30,.08);animation:mgBlink 5.6s infinite}
.mg-lid-left{left:var(--mg-le-x);top:var(--mg-le-y);width:var(--mg-le-w);height:var(--mg-le-h)}
.mg-lid-right{left:var(--mg-re-x);top:var(--mg-re-y);width:var(--mg-re-w);height:var(--mg-re-h)}
.mg-face.alert .mg-lid{animation-duration:4.4s}
.mg-face.happy .mg-lid{animation-duration:6.2s}
.mg-mouth-live{display:none!important;position:absolute;left:var(--mg-mouth-x);top:var(--mg-mouth-y);width:var(--mg-mouth-w);height:var(--mg-mouth-h);border-radius:999px;opacity:0;background:radial-gradient(ellipse at 50% 34%,#43262a 0%,#2a1518 58%,#160b0d 100%);box-shadow:inset 0 -1.5px 0 rgba(255,132,132,.38),0 1px 2px rgba(82,31,34,.12);transform-origin:50% 42%}
.mg-mouth-live.talk{animation:mgTalk 2.2s ease-in-out infinite}
.mg-mouth-live.pop{animation:mgPop 2.6s ease-in-out infinite}
.mg-mouth-live.quiet{display:none}
@keyframes mgBlink{0%,88%,94%,100%{opacity:0;transform:scaleY(.04)}90%,92%{opacity:.96;transform:scaleY(1)}}
@keyframes mgTalk{0%,100%{transform:scaleX(.88) scaleY(.18);opacity:.18}42%,58%{transform:scaleX(.96) scaleY(.68);opacity:.9}}
@keyframes mgPop{0%,100%{transform:scale(.84,.16);opacity:.2}46%,54%{transform:scale(.96,.74);opacity:.88}}
`;
