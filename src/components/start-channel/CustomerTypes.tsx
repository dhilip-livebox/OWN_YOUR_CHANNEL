import { motion } from "framer-motion";
import { Users, Briefcase, Building, Megaphone, Newspaper, Church, GraduationCap, Tv2, Video, Users2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const customerIcons = [
  Users,
  Briefcase,
  Building,
  Megaphone,
  Newspaper,
  Church,
  GraduationCap,
  Tv2,
  Video,
  Users2,
];

export function CustomerTypes() {
  const { t } = useTranslation();
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">
            {t('startChannel.customers.title')}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {customerIcons.map((Icon, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center gap-2 rounded-full border border-border/60 bg-surface/30 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <Icon className="h-4 w-4 text-primary" />
                {t(`startChannel.customers.types.${index}`)}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
