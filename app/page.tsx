"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 119;

const facts = [
  {
    title: "71% of Earth is covered by water.",
    body: "An endless planetary system shaping climate, life, movement, and memory.",
  },
  {
    title: "Humans are composed of nearly 60% water.",
    body: "Every pulse, breath, and thought depends on fluid balance.",
  },
  {
    title: "Water exists naturally in three states.",
    body: "Solid. Liquid. Vapor.",
  },
  {
    title: "Every water molecule forms hydrogen bonds.",
    body: "Invisible molecular structures creating cohesion and flow.",
  },
];

function WaterSequence() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvasSize();

    window.addEventListener("resize", setCanvasSize);

    const currentFrame = (index: number) =>
      `/frames/frame_${index.toString().padStart(3, "0")}.webp`;

    const images: HTMLImageElement[] = [];

    let loaded = 0;

    const animation = {
      frame: 0,
    };

    const render = (index: number) => {
      const img = images[index];

      if (!img || !img.complete) return;

      context.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      const isMobile = window.innerWidth < 768;

      let scale;

      if (isMobile) {
        scale = Math.max(
          (window.innerWidth * 1.15) / img.width,
          (window.innerHeight * 1.05) / img.height
        );
      } else {
        scale = Math.max(
          (window.innerWidth * 0.92) / img.width,
          (window.innerHeight * 0.92) / img.height
        );
      }

      const width = img.width * scale;
      const height = img.height * scale;

      const x = (window.innerWidth - width) / 2;
      const y = (window.innerHeight - height) / 2;

      context.drawImage(img, x, y, width, height);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();

      img.src = currentFrame(i);

      img.onload = () => {
        loaded++;

        if (i === 0) render(0);

        if (loaded === FRAME_COUNT) {
          gsap.to(animation, {
            frame: FRAME_COUNT - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
              trigger: "#experience",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
            onUpdate: () => {
              render(Math.floor(animation.frame));
            },
          });
        }
      };

      images.push(img);
    }

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_50%)]" />

      {/* glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[200px] w-[400px] h-[400px] md:w-[1000px] md:h-[1000px]" />

      {/* reflection */}
      <div className="absolute bottom-[12%] md:bottom-[8%] left-1/2 -translate-x-1/2 rounded-full bg-white/[0.08] blur-[140px] w-[220px] h-[60px] md:w-[800px] md:h-[180px]" />

      {/* canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}
      className="max-w-4xl"
    >
      <h2 className="text-4xl sm:text-5xl md:text-7xl leading-[0.95] tracking-[-0.05em] font-light">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-6 md:mt-8 text-zinc-500 text-base md:text-lg leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default function Page() {
  const container = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll();

  const scrollPercent = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollPercent.set(Math.round(latest * 100));
  });

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.15],
    [0, -250]
  );

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main
      id="experience"
      ref={container}
      className="relative bg-black text-white overflow-hidden"
    >
      {/* BG ANIMATION */}
      <WaterSequence />

      {/* FILM GRAIN */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-screen z-[200]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
          }}
        />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-[500] px-5 md:px-10 py-6">
        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-3 text-[9px] md:text-[10px] tracking-[0.45em] uppercase text-white/90">
                <div className="w-6 h-[1px] bg-white/40" />
                <span>H₂O</span>
              </div>

              <p className="mt-2 text-[8px] md:text-[9px] tracking-[0.55em] uppercase text-zinc-500">
                An Exhibition — Vol. 01
              </p>
            </div>

            <p className="text-[8px] md:text-[9px] tracking-[0.5em] uppercase text-zinc-600">
              The Architecture Of Life
            </p>
          </div>

          {/* CENTER */}
          <nav className="hidden md:flex items-center gap-10 text-[9px] tracking-[0.5em] uppercase text-zinc-500">
            <a href="#intro" className="hover:text-white transition-all duration-500">
              Intro
            </a>

            <a href="#facts" className="hover:text-white transition-all duration-500">
              Facts
            </a>

            <a href="#science" className="hover:text-white transition-all duration-500">
              Science
            </a>

            <a href="#motion" className="hover:text-white transition-all duration-500">
              Motion
            </a>

            <a href="#end" className="hover:text-white transition-all duration-500">
              End
            </a>
          </nav>

          {/* RIGHT */}
          <div className="hidden md:block">
            <p className="text-[9px] tracking-[0.55em] uppercase text-zinc-500">
              An Interactive Exhibition
            </p>
          </div>
        </div>
      </header>

      {/* SCROLL TRACKER */}
      <div className="fixed left-5 md:left-8 bottom-10 z-[400] flex items-end gap-5">

        {/* scroll text */}
        <div className="rotate-[-90deg] origin-left">
          <motion.p className="text-[8px] md:text-[9px] tracking-[0.55em] uppercase text-zinc-500">
            Scroll
          </motion.p>
        </div>

        {/* line */}
        <div className="relative w-[1px] h-32 md:h-40 bg-white/10 overflow-hidden">
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute bottom-0 left-0 w-full h-full bg-white/50 origin-bottom"
          />
        </div>

        {/* counter */}
        <div className="rotate-[-90deg] origin-left translate-y-10">
          <motion.p className="text-[8px] md:text-[9px] tracking-[0.5em] uppercase text-zinc-600">
            {scrollPercent.get()}
          </motion.p>
        </div>
      </div>

      {/* HERO */}
      <section className="relative h-[200vh] z-20">
        <div className="sticky top-0 h-screen overflow-hidden">

          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 z-30"
          >
            {/* H2O */}
            <div className="absolute left-[-8vw] md:left-[-5vw] top-[4vh] md:top-[2vh] leading-none select-none">
              <div className="text-[42vw] md:text-[26vw] font-thin tracking-[-0.12em] text-white/[0.9]">
                H
              </div>

              <div className="absolute top-[18%] right-[-8%] text-[8vw] md:text-[5vw] text-white/70 italic">
                2
              </div>

              <div className="text-[42vw] md:text-[26vw] font-thin tracking-[-0.12em] text-white/[0.08] -mt-[8vw] ml-[8vw]">
                O
              </div>
            </div>

            {/* copy */}
            <div className="absolute left-[8%] right-[8%] md:right-auto bottom-[10%] md:bottom-[12%] max-w-xl">
              <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-zinc-500 mb-6 md:mb-8">
                Cinematic Water Experience
              </p>

              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-[-0.06em]">
                More than
                <br />
                a molecule.
              </h1>

              <p className="mt-6 md:mt-8 text-zinc-500 text-base md:text-lg leading-relaxed max-w-md">
                A premium immersive exploration of fluid motion,
                molecular elegance, and cinematic atmosphere.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <section
        id="intro"
        className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-28 py-24 md:py-40 z-20"
      >
        <SectionHeading
          title="The architecture of life."
          subtitle="Water exists as memory, reflection, atmosphere, silence, and motion."
        />
      </section>

      {/* FACTS */}
      <section
        id="facts"
        className="relative px-6 md:px-16 lg:px-28 py-24 md:py-40 z-20"
      >
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-32">
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="border-t border-white/10 pt-8 md:pt-12"
            >
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-[-0.04em]">
                  {fact.title}
                </h3>

                <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-lg">
                  {fact.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SCIENCE */}
      <section
        id="science"
        className="relative min-h-screen px-6 md:px-16 lg:px-28 py-32 md:py-48 z-20"
      >
        <div className="max-w-7xl mx-auto">

          <div className="mb-24">
            <SectionHeading
              title="Fluid intelligence."
              subtitle="Molecular structures shaping reflection, pressure, silence and movement."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">

            {/* CARD 1 */}
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-[30px] p-8 md:p-12 min-h-[380px] flex flex-col justify-between">

              <div>
                <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-500 mb-8">
                  Molecular Structure
                </p>

                <h3 className="text-3xl md:text-5xl font-light tracking-[-0.05em]">
                  Invisible geometry.
                </h3>
              </div>

              <div className="relative h-[180px]">
                <div className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />

                <div className="absolute left-[35%] top-[35%] w-2 h-2 rounded-full bg-white/60" />

                <div className="absolute right-[35%] bottom-[35%] w-2 h-2 rounded-full bg-white/60" />

                <svg className="absolute inset-0 w-full h-full opacity-40">
                  <line
                    x1="50%"
                    y1="50%"
                    x2="35%"
                    y2="35%"
                    stroke="white"
                    strokeWidth="1"
                  />

                  <line
                    x1="50%"
                    y1="50%"
                    x2="65%"
                    y2="65%"
                    stroke="white"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-[30px] p-8 md:p-12 min-h-[380px] flex flex-col justify-between">

              <div>
                <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-500 mb-8">
                  Atmospheric Motion
                </p>

                <h3 className="text-3xl md:text-5xl font-light tracking-[-0.05em]">
                  Energy without form.
                </h3>
              </div>

              <div className="relative h-[180px] overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -80],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute rounded-full bg-white/40 blur-[2px]"
                    style={{
                      width: Math.random() * 4 + 2,
                      height: Math.random() * 4 + 2,
                      left: `${Math.random() * 100}%`,
                      bottom: `-${Math.random() * 50}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOTION */}
      <section
        id="motion"
        className="relative min-h-screen flex items-center justify-center px-6 z-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          viewport={{ once: true }}
          className="text-center max-w-5xl"
        >
          <p className="text-[10px] tracking-[0.5em] uppercase text-zinc-500 mb-10">
            Fluid Motion
          </p>

          <h2 className="text-5xl md:text-8xl font-light leading-[0.9] tracking-[-0.07em]">
            Nature in motion.
          </h2>
        </motion.div>
      </section>

      {/* END */}
      <section
        id="end"
        className="relative min-h-screen flex flex-col items-center justify-center z-20 px-6 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="text-center relative z-10"
        >
          <div className="text-[28vw] md:text-[14vw] font-thin tracking-[-0.12em] leading-none text-white/90">
            H₂O
          </div>

          <p className="mt-6 md:mt-8 text-zinc-500 tracking-[0.3em] uppercase text-[10px] md:text-sm">
            Pure by nature.
          </p>
        </motion.div>

        {/* FOOTER */}
        <footer className="absolute bottom-0 left-0 w-full border-t border-white/10 px-6 md:px-10 py-10">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

            {/* LEFT */}
            <div>
              <div className="flex items-center gap-3 text-[9px] tracking-[0.45em] uppercase text-white/90">
                <div className="w-6 h-[1px] bg-white/40" />
                <span>H₂O</span>
              </div>

              <p className="mt-3 text-[8px] md:text-[9px] tracking-[0.5em] uppercase text-zinc-600">
                © 2026 — Pure By Nature
              </p>
            </div>

            {/* CENTER */}
            <div className="flex items-center gap-8 text-[8px] md:text-[9px] tracking-[0.5em] uppercase text-zinc-500">
              <a href="https://www.linkedin.com/in/lakshyaraj-singh-sisodiya-6b4b66338/" className="hover:text-white transition-all duration-500">
                LinkedIn
              </a>

              <a href="https://x.com/llakshhya" className="hover:text-white transition-all duration-500">
                Twitter
              </a>

              <a href="https://github.com/lakshyarajsinghsisodiya" className="hover:text-white transition-all duration-500">
                GitHub
              </a>
            </div>

            {/* RIGHT */}
            <div>
              <p className="text-[8px] md:text-[9px] tracking-[0.55em] uppercase text-zinc-600">
                Cinematic Interactive Experience
              </p>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}