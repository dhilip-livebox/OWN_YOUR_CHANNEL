import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { PhoneCall, Play, Server } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Hero() {
  const { t } = useTranslation();

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
            {t('hero.liveAcross')}
          </div>

          <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-white drop-shadow-lg max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="block bg-gradient-to-br from-white via-white to-primary/80 bg-clip-text text-transparent uppercase"
            >
              {t('hero.headline')}
            </motion.span>
          </h1>

          <p className="mt-6 max-w-xl text-xl font-medium text-white drop-shadow-md">
            {t('hero.subheadline')}
          </p>

          <p className="mt-4 max-w-xl text-sm font-bold text-primary drop-shadow-md tracking-wide">
            {t('hero.features')}
          </p>
          
          <p className="mt-2 max-w-xl text-sm font-medium text-white/80 drop-shadow-md">
            {t('hero.audience')}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/start-channel"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_60%,transparent),0_10px_40px_-10px_color-mix(in_oklch,var(--primary)_60%,transparent)] transition hover:brightness-110 hover:scale-[1.02]"
            >
              <Play className="h-4 w-4 fill-current" />
              {t('hero.startChannelBtn')}
            </Link>
            
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/20 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white transition hover:border-primary/50 hover:bg-black/40"
            >
              <Server className="h-4 w-4" />
              {t('hero.buildServerBtn')}
            </Link>

            <a
              href="/#register"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/20 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white transition hover:border-primary/50 hover:bg-black/40"
            >
              <PhoneCall className="h-4 w-4" />
              {t('hero.talkConsultantBtn')}
            </a>
          </div>
        </div>

        {/* Right column graphic using the image */}
        <div className="absolute right-0 top-0 h-full w-full lg:w-[60%] z-0 pointer-events-none overflow-hidden opacity-30 lg:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
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
