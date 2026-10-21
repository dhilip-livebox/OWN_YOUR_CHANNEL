import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { GraduationCap, HeartPulse, Building, Users, RadioTower, Landmark, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Solutions for Your Industry - CDTECH" },
      { name: "description", content: "Industry-specific media infrastructure solutions." },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  const { t } = useTranslation();
  const industries = [
    {
      id: "education",
      icon: GraduationCap,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-500"
    },
    {
      id: "healthcare",
      icon: HeartPulse,
      color: "from-rose-500/20 to-rose-500/5",
      iconColor: "text-rose-500"
    },
    {
      id: "corporate",
      icon: Building,
      color: "from-violet-500/20 to-violet-500/5",
      iconColor: "text-violet-500"
    },
    {
      id: "ngo-community",
      icon: Users,
      color: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-500"
    },
    {
      id: "media-broadcasters",
      icon: RadioTower,
      color: "from-fuchsia-500/20 to-fuchsia-500/5",
      iconColor: "text-fuchsia-500"
    },
    {
      id: "government",
      icon: Landmark,
      color: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-500"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden py-24 lg:py-32 bg-card/30 border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
          <div className="mx-auto max-w-[1600px] px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground uppercase">
              {t('industries.pageTitle')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('industries.pageSubtitle')}
            </p>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="mx-auto max-w-[1600px] px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map(ind => (
                <Link 
                  key={ind.id} 
                  to="/industry/$id"
                  params={{ id: ind.id }}
                  className={`group relative flex flex-col p-8 rounded-3xl border border-border/60 bg-gradient-to-br ${ind.color} backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 overflow-hidden`}
                >
                  <div className="absolute top-8 right-8 text-muted-foreground transition-transform duration-300 group-hover:translate-x-2 group-hover:text-primary">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <ind.icon className={`w-14 h-14 mb-6 ${ind.iconColor} drop-shadow-sm`} />
                  <h3 className="text-2xl font-bold text-foreground mb-3">{t(`industries.list.${ind.id}.name`)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(`industries.list.${ind.id}.desc`)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
