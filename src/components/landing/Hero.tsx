import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Camera, CloudDownload, Globe, Mic2, MonitorPlay, PlayCircle, RadioTower } from "lucide-react";
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
    <section id="hero" className="relative overflow-hidden">
      {/* radial glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[10%] h-[520px] w-[520px] -translate-x-1/2 glow-gold opacity-70" />
        <div className="absolute right-[-10%] top-[40%] h-[400px] w-[400px] glow-blue opacity-60" />
      </div>

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-live animate-live-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            LIVE across Facebook, YouTube, OTT &amp; Cable — simultaneously
          </div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,5.25rem)] font-bold leading-[1.02] tracking-tight text-foreground">
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="block bg-gradient-to-br from-foreground via-foreground to-primary/70 bg-clip-text text-transparent"
            >
              {headlines[i]}
            </motion.span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
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
              className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:text-accent"
            >
              Get Free Consultation
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
            {heroFeatures.map(({ icon: Icon, label, description, color }) => (
              <div key={label} className="flex flex-col gap-2">
                <Icon className={`h-6 w-6 ${color}`} />
                <p className={`text-xs font-bold uppercase tracking-wide ${color}`}>{label}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <BroadcastTower reduce={!!reduce} />
      </div>
    </section>
  );
}

function BroadcastTower({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[500px]">
      {/* rings */}
      <div aria-hidden className="absolute inset-0">
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40"
            style={{
              animation: reduce ? undefined : `pulse-ring 3s ease-out ${n * 0.75}s infinite`,
            }}
          />
        ))}
      </div>
      {/* tower svg */}
      <svg viewBox="0 0 200 200" className="relative h-full w-full">
        <defs>
          <linearGradient id="tower-g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.79 0.155 82)" />
            <stop offset="100%" stopColor="oklch(0.66 0.17 253)" />
          </linearGradient>
        </defs>
        <g stroke="url(#tower-g)" strokeWidth="2" fill="none" strokeLinecap="round">
          <circle cx="100" cy="70" r="6" fill="oklch(0.79 0.155 82)" />
          <path d="M100 76 L82 170" />
          <path d="M100 76 L118 170" />
          <path d="M88 110 L112 110" />
          <path d="M85 130 L115 130" />
          <path d="M82 150 L118 150" />
          <path d="M75 172 L125 172" strokeWidth="3" />
          {/* signal arcs */}
          <path d="M70 60 Q100 40 130 60" opacity="0.7" />
          <path d="M55 55 Q100 20 145 55" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}
