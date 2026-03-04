"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "lucide-react";
import "../i18n";

export default function AboutSection() {
  const { t } = useTranslation("common");

  const rawCoreValues = t("about.values", {
    returnObjects: true,
  }) as unknown;

  const items = Array.isArray(rawCoreValues)
    ? (rawCoreValues as {
        title: string;
        description: string;
      }[])
    : [];

  /* AUTO SLIDE */
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2800);
  };

  useEffect(() => {
  if (!items.length) return;

  startAuto();

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [items.length]);

  const handleClick = (i: number) => {
    setActiveIndex(i);
    intervalRef.current && clearInterval(intervalRef.current);
    startAuto();
  };

  return (
<>
<style>{`

.about-section{
  background:#faf7f6;
  padding:100px 24px;
  font-family: system-ui, -apple-system, sans-serif;
}

.about-inner{
  max-width:1150px;
  margin:auto;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:80px;
  align-items:center;
}

/* ========= LEFT ========= */

.title-row{
  display:flex;
  align-items:center;
  gap:28px;
}

.big-number{
  font-size:clamp(180px,25vw,250px);
  font-weight:800;
  background:linear-gradient(
    135deg,
    #ff6b6b,
    #ffa5a5,
    #ffd6d6
  );
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

/* TITLE DỌC */
.vertical-label{
  font-size:30px;
  font-weight:700;
  letter-spacing:.25em;
  text-transform:uppercase;
  color:#2a2a2a;

  writing-mode:vertical-rl;
  transform:rotate(180deg);
}

/* DESCRIPTION */
.points-label{
  margin-top:26px;
  max-width:560px;
  font-size:16px;
  line-height:1.8;
  color:#666;
}

/* ========= RIGHT ========= */

.right-side{
  display:flex;
  flex-direction:column;
  gap:18px;
}

.item-card{
  background:white;
  border-radius:18px;
  padding:26px 30px;
  display:flex;
  gap:18px;
  cursor:pointer;
  transition:.55s cubic-bezier(.23,1,.32,1);
  position:relative;
  overflow:hidden;
  box-shadow:0 4px 14px rgba(0,0,0,.05);
   overflow:visible;
}

/* ACTIVE nổi sang trái */
.item-card.active{
  transform:translateX(-18px) scale(1.05);
  z-index:5;
  box-shadow:
    0 30px 60px rgba(255,107,107,.25),
    0 10px 25px rgba(0,0,0,.12);
}

.item-card.inactive{
  opacity:.4;
  transform:scale(.96);
}

.num-circle{
  width:42px;
  height:42px;
  border-radius:50%;
  border:2px solid #ffe3e3;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:600;
  color:#ff6b6b;
  flex-shrink:0;
}

.item-card.active .num-circle{
  background:linear-gradient(
    135deg,
    #ff6b6b,
    #ffa5a5
  );
  color:white;
  border:none;
}

.item-title{
  font-size:18px;
  font-weight:600;
  margin-bottom:6px;
  color:#222;
}

.item-desc{
  font-size:14px;
  color:#777;
  line-height:1.6;
}

/* ICON nổi */
.active-icon{
  position:absolute;
  top:50%;
  right:0;

  transform:
    translate(45%,-50%)
    rotate(12deg)
    perspective(600px)
    rotateY(-12deg);

  width:64px;
  height:64px;
  border-radius:18px;

  display:flex;
  align-items:center;
  justify-content:center;

  animation:float3D 4s ease-in-out infinite;

  z-index:20;
}

  color:white;

  box-shadow:
    0 20px 45px rgba(255,107,107,.35);

  animation:floatIcon 3s ease-in-out infinite;
}


@keyframes floatIcon{
  0%,100%{
    transform:translateY(-50%) rotate(18deg);
  }
  50%{
    transform:translateY(-65%) rotate(22deg);
  }
}

/* PROGRESS */
.progress-bar{
  position:absolute;
  bottom:0;
  left:0;
  height:3px;
  width:0%;
  background:linear-gradient(
    90deg,
    #ff6b6b,
    #ffc1c1
  );
}

.item-card.active .progress-bar{
  animation:fillBar 2.8s linear forwards;
}

@keyframes fillBar{
  from{width:0}
  to{width:100%}
}

/* MOBILE */
@media(max-width:768px){
  .about-inner{
    grid-template-columns:1fr;
  }

  .vertical-label{
    writing-mode:horizontal-tb;
    transform:none;
  }
}

`}</style>

<section className="about-section">
<div className="about-inner">

{/* LEFT */}
<div>

<div className="title-row">
<div className="big-number">
{items.length}
</div>

<h2 className="vertical-label">
{t("about.title")}
</h2>
</div>

<p className="points-label">
{t("about.description")}
</p>

</div>

{/* RIGHT */}
<div className="right-side">
{items.map((item,i)=>(
<div
key={i}
className={`item-card ${
i===activeIndex?"active":"inactive"
}`}
onClick={()=>handleClick(i)}
>

<div className="num-circle">
{String(i+1).padStart(2,"0")}
</div>

<div>
<h3 className="item-title">{item.title}</h3>
<p className="item-desc">{item.description}</p>
</div>

{i===activeIndex &&(
  <div className="active-icon">
    <img
      src="/logo.svg"
      alt="logo"
      className="active-logo"
    />
  </div>
)}

<div
className="progress-bar"
key={`${activeIndex}-${i}`}
/>

</div>
))}
</div>

</div>
</section>
</>
);
}