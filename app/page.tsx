"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      context.scale(2, 2);
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

      const scale = Math.min(
        window.innerWidth / img.width,
        window.innerHeight / img.height
      );

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
      <div className="absolute w-[1000px] h-[1000px] rounded-full bg-white/[0.04] blur-[200px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* reflection */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[800px] h-[180px] rounded-full bg-white/[0.08] blur-[140px]" />

      {/* canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
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
      <h2 className="text-5xl md:text-7xl leading-[0.95] tracking-[-0.05em] font-light">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-8 text-zinc-500 text-lg leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default function Page() {
  const container = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll();

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
      {/* persistent cinematic bg */}
      <WaterSequence />

      {/* grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-screen z-[200]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
          }}
        />
      </div>

      {/* progress line */}
      <motion.div
        style={{ scaleY: scrollYProgress }}
        className="fixed top-0 right-5 w-[1px] h-full bg-white/40 origin-top z-[300]"
      />

      {/* HERO */}
      <section className="relative h-[200vh] z-20">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 z-30"
          >
            {/* giant H2O */}
            <div className="absolute left-[-5vw] top-[2vh] leading-none select-none">
              <div className="text-[34vw] md:text-[26vw] font-thin tracking-[-0.12em] text-white/[0.9]">
                H
              </div>

              <div className="absolute top-[18%] right-[-8%] text-[5vw] text-white/70 italic">
                2
              </div>

              <div className="text-[34vw] md:text-[26vw] font-thin tracking-[-0.12em] text-white/[0.1] -mt-[8vw] ml-[8vw]">
                O
              </div>
            </div>

            {/* hero copy */}
            <div className="absolute left-[8%] bottom-[12%] max-w-xl">
              <p className="text-xs tracking-[0.4em] uppercase text-zinc-500 mb-8">
                Cinematic Water Experience
              </p>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-[-0.06em]">
                More than
                <br />
                a molecule.
              </h1>

              <p className="mt-8 text-zinc-500 text-lg leading-relaxed max-w-md">
                A premium immersive exploration of fluid motion,
                molecular elegance, and cinematic atmosphere.
              </p>
            </div>
          </motion.div>

          {/* scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4 text-zinc-500 text-xs tracking-[0.4em] uppercase">
            <span>Scroll</span>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="w-[1px] h-16 bg-white/20"
            />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative min-h-screen flex items-center px-8 md:px-16 lg:px-28 py-40 z-20">
        <SectionHeading
          title="The architecture of life."
          subtitle="Water exists as memory, reflection, atmosphere, silence, and motion."
        />
      </section>

      {/* FACTS */}
      <section className="relative px-8 md:px-16 lg:px-28 py-40 z-20">
        <div className="max-w-7xl mx-auto space-y-32">
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="border-t border-white/10 pt-12"
            >
              <div className="grid lg:grid-cols-2 gap-12">
                <h3 className="text-3xl md:text-5xl font-light tracking-[-0.04em]">
                  {fact.title}
                </h3>

                <p className="text-zinc-500 text-lg leading-relaxed max-w-lg">
                  {fact.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* END */}
      <section className="relative min-h-screen flex items-center justify-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="text-[20vw] md:text-[14vw] font-thin tracking-[-0.12em] leading-none text-white/90">
            H₂O
          </div>

          <p className="mt-8 text-zinc-500 tracking-[0.3em] uppercase text-sm">
            Pure by nature.
          </p>
        </motion.div>
      </section>
    </main>
  );
}