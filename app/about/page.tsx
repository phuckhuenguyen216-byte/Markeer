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
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800;900&display=swap');
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
  font-size:clamp(240px,30vw,320px);
  font-weight:900;

  font-family:
    "Orbitron",
    "Rajdhani",
    system-ui,
    sans-serif;

  letter-spacing:-6px;
  margin-left:100px;

  background:linear-gradient(
    120deg,
    #ff0000,
    #ff4d00,
    #ff7a18,
    #ff3b7a,
    #ff8ac6,
    #ffd900,
    #ff0000
  );

  background-size:400% 400%;

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;

  

  animation:colorFlow 6s ease infinite;

  position:relative;
}

@keyframes colorFlow{
  0%{
    background-position:0% 50%;
  }
  50%{
    background-position:100% 50%;
  }
  100%{
    background-position:0% 50%;
  }
}

/* viền glow nhẹ */
.big-number::after{
  content:attr(data-number);
  position:absolute;
  left:0;
  top:0;

  color:transparent;
  -webkit-text-stroke:2px rgba(255,120,120,.25);

  z-index:-1;
}

/* TITLE DỌC */
.vertical-label{
  font-size:42px;
  font-weight:700;
  letter-spacing:.28em;
  text-transform:uppercase;

  margin-left:130px;

  writing-mode:vertical-rl;
  transform:rotate(180deg);

  /* Gradient đen → đỏ */
  background: linear-gradient(
    180deg,
    #252323,
    #3a0e0e,
    #6b0000,
    #b30000,
    #ff2a2a
  );

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}

/* DESCRIPTION */
.points-label{
  margin-top:26px;
  max-width:560px;
  font-size:17px;
  line-height:1.8;
  color:#666;
}

// .about-introduce{
//   margin-top:14px;
//   max-width:560px;
//   font-size:16px;
//   line-height:1.7;
//   color:#444;
//   font-weight:500;
// }

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

.about-section{
  padding:70px 20px;
}

.about-inner{
  grid-template-columns:1fr;
  gap:40px;
}

/* TITLE AREA */
.title-row{
  flex-direction:column;
  align-items:center;
  text-align:center;
  gap:10px;
}

.big-number{
  font-size:120px;
  margin-left:0;
  line-height:1;
}

.vertical-label{
  writing-mode:horizontal-tb;
  transform:none;
  margin-left:0;
  font-size:26px;
  letter-spacing:.12em;
}

/* TEXT */
.points-label{
  margin-top:26px;
  max-width:560px;
  font-size:16px;
  line-height:1.8;
  color:#666;
  text-align:justify;
}

/* CARDS */
.item-card{
  padding:20px 20px;
}

/* disable translate mobile */
.item-card.active{
  transform:scale(1.02);
}

.item-card.inactive{
  opacity:.6;
  transform:scale(.98);
}

/* ICON */
.active-icon{
  width:52px;
  height:52px;
  transform:translate(35%,-50%) rotate(12deg);
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