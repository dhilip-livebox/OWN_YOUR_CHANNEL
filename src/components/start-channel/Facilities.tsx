import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Facilities() {
  const { t } = useTranslation();
  const facilityCount = 11;
  return (
    <section className="bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left Column: Messaging */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('startChannel.facilities.titleLine1')} <br/>
              <span className="text-primary">{t('startChannel.facilities.titleLine2')}</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              {t('startChannel.facilities.description')}
            </p>
            
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">{t('startChannel.facilities.startingSolution')}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-foreground">{t('startChannel.facilities.priceText')}</span>
                <span className="text-sm text-muted-foreground">{t('startChannel.facilities.priceSub')}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('startChannel.facilities.pricingNote')}
              </p>
            </div>
          </motion.div>

          {/* Right Column: Facilities List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-border bg-card p-8 shadow-sm"
          >
            <h3 className="mb-6 text-xl font-bold text-foreground">{t('startChannel.facilities.includedTitle')}</h3>
            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {Array.from({ length: facilityCount }).map((_, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground/90">{t(`startChannel.facilities.items.${i}`)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
