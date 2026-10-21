import { journeySteps } from "@/data/journey";
import { SectionHeading } from "./SectionHeading";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function JourneyTimeline() {
  const { t } = useTranslation();

  return (
    <section id="journey" className="mx-auto max-w-[1600px] px-6 py-24">
      <SectionHeading
        eyebrow={t('journey.eyebrow')}
        title={t('journey.title')}
        subtitle={t('journey.subtitle')}
      />
      <ol className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {journeySteps.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
            className="card-surface card-surface-hover flex gap-4 p-5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/10 font-display text-sm font-bold text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-foreground">{t(`journey.steps.${i}.title`, { defaultValue: step.title })}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(`journey.steps.${i}.body`, { defaultValue: step.body })}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
