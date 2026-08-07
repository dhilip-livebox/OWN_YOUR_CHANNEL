import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Camera, CloudDownload, Globe, Mic2, MonitorPlay, RadioTower } from "lucide-react";
import { Link } from "@tanstack/react-router";

const headlines = [
  "Build your own live tv chanell",
  "own your chanel",
  "broadcast in multiple platform  without sytem and Local internet",
];

const heroFeatures = [
  {
    icon: MonitorPlay,
    label: "Professional Playout to Download",
    description: "Get broadcast-ready playout with graphics, automation and scheduling.",
    color: "text-cyan-400",
  },
  {
    icon: CloudDownload,
    label: "Your Own Streaming Platform",
    description: "Launch your branded streaming platform under your own name.",
    color: "text-violet-400",
  },
  {
    icon: RadioTower,
    label: "Stream Everywhere",
    description: "Stream to multiple social media, OTT, websites, mobile platforms and local TVs.",
    color: "text-amber-400",
  },
  {
    icon: Camera,
    label: "Produce Your Own Programs",
    description: "Create stunning shows, live or recorded, with professional quality.",
    color: "text-lime-400",
  },
  {
    icon: Mic2,
    label: "Podcasts & Panel Discussions",
    description: "Host engaging podcasts and panel discussions that inform and inspire.",
    color: "text-rose-400",
  },
  {
    icon: Globe,
    label: "Broadcast to the World",
    description: "Reach global audiences and grow your brand without limits.",
    color: "text-sky-400",
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % headlines.length), 3800);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <section 
      id="hero" 
      className="relative flex min-h-[100svh] lg:min-h-[800px] items-center overflow-hidden"
    >
      {/* radial glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[20%] top-[10%] h-[520px] w-[520px] -translate-x-1/2 glow-purple opacity-40 mix-blend-screen" />
        <div className="absolute right-[-10%] top-[40%] h-[400px] w-[400px] glow-blue opacity-40 mix-blend-screen" />
      </div>

      <div className="relative mx-auto w-full grid max-w-[1600px] grid-cols-1 items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2">
        <div className="relative z-10 lg:pr-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-live animate-live-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            LIVE across Facebook, YouTube, OTT &amp; Cable — simultaneously
          </div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,5.25rem)] font-bold leading-[1.02] tracking-tight text-white drop-shadow-lg min-h-[4em] lg:min-h-[3.2em] max-w-3xl">
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="block bg-gradient-to-br from-white via-white to-primary/80 bg-clip-text text-transparent"
            >
              {headlines[i]}
            </motion.span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/80 drop-shadow-md">
            Broadcast simultaneously to social media, OTT, IPTV and local cable —
            fully automated by AI, on servers you control. No high-speed internet.
            No PC left running.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/purchase"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_60%,transparent),0_10px_40px_-10px_color-mix(in_oklch,var(--primary)_60%,transparent)] transition hover:brightness-110 hover:scale-[1.02]"
            >
              View Pricing & Packages
              <span className="transition group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href="/#register"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/20 backdrop-blur-md px-6 py-3 text-sm font-semibold text-white transition hover:border-primary/50 hover:bg-black/40"
            >
              Get Free Consultation
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
            {heroFeatures.map(({ icon: Icon, label, description, color }) => (
              <div key={label} className="flex flex-col gap-2 drop-shadow-md">
                <Icon className={`h-6 w-6 ${color}`} />
                <p className={`text-xs font-bold uppercase tracking-wide ${color}`}>{label}</p>
                <p className="text-xs leading-relaxed text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column graphic using the image */}
        <div className="absolute right-0 top-0 h-full w-full lg:w-[60%] z-0 pointer-events-none overflow-hidden opacity-30 lg:opacity-100">
          {/* Fade mask to blend the left edge of the image smoothly into the background */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
          {/* Fade mask for the top/bottom edges just in case */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-10" />
          
          <img 
            src="/image.png" 
            alt="Broadcast Station" 
            className="w-full h-full object-cover object-right"
          />
        </div>
      </div>
    </section>
  );
}
