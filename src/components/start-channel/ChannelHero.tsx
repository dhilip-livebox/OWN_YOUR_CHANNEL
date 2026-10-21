import { motion } from "framer-motion";
import { Play, ArrowRight, MonitorPlay, RadioTower, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ChannelHero() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-16 lg:pt-40 lg:pb-24">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t('startChannel.hero.badge')}
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl uppercase">
            {t('startChannel.hero.titleLine1')} <br />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{t('startChannel.hero.titleLine2')}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl font-medium text-foreground sm:text-2xl">
            {t('startChannel.hero.subtitle')}
          </p>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t('startChannel.hero.description')}
          </p>
        </motion.div>

        {/* Workflow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-16 max-w-5xl rounded-3xl border border-border/50 bg-surface/50 p-6 sm:p-10 backdrop-blur-md shadow-2xl shadow-black/10"
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 ring-1 ring-violet-500/20">
                <Play className="h-8 w-8 text-violet-500" />
              </div>
              <p className="mt-4 font-bold text-foreground">{t('startChannel.hero.steps.0.title')}</p>
              <p className="text-xs text-muted-foreground">{t('startChannel.hero.steps.0.desc')}</p>
            </div>

            <ArrowRight className="hidden h-6 w-6 text-muted-foreground md:block" />
            <div className="h-6 w-[2px] bg-border md:hidden" />

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-1 ring-cyan-500/20">
                <MonitorPlay className="h-8 w-8 text-cyan-500" />
              </div>
              <p className="mt-4 font-bold text-foreground">{t('startChannel.hero.steps.1.title')}</p>
              <p className="text-xs text-muted-foreground">{t('startChannel.hero.steps.1.desc')}</p>
            </div>

            <ArrowRight className="hidden h-6 w-6 text-muted-foreground md:block" />
            <div className="h-6 w-[2px] bg-border md:hidden" />

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
                <RadioTower className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 font-bold text-foreground">{t('startChannel.hero.steps.2.title')}</p>
              <p className="text-xs text-muted-foreground">{t('startChannel.hero.steps.2.desc')}</p>
            </div>

            <ArrowRight className="hidden h-6 w-6 text-muted-foreground md:block" />
            <div className="h-6 w-[2px] bg-border md:hidden" />

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 ring-1 ring-amber-500/20">
                <Globe className="h-8 w-8 text-amber-500" />
              </div>
              <p className="mt-4 font-bold text-foreground">{t('startChannel.hero.steps.3.title')}</p>
              <p className="text-xs text-muted-foreground">{t('startChannel.hero.steps.3.desc')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
