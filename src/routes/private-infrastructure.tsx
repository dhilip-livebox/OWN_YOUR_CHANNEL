import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { UniversalRequirementForm } from "@/components/forms/UniversalRequirementForm";
import { Cloud, Cpu, Server, Network, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/private-infrastructure")({
  head: () => ({
    meta: [
      { title: "Enterprise Media Infrastructure - CDTECH" },
      { name: "description", content: "From a Dedicated Server to Your Own Private Cloud, CDN and Complete Media Network." },
    ],
  }),
  component: PrivateInfrastructurePage,
});

function PrivateInfrastructurePage() {
  const { t } = useTranslation();
  const levels = [
    {
      level: 1,
      title: t('privateInfrastructure.levels.0.title'),
      description: t('privateInfrastructure.levels.0.description'),
      icon: Cloud,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-500",
      image: "/infra_cloud_account.jpg"
    },
    {
      level: 2,
      title: t('privateInfrastructure.levels.1.title'),
      description: t('privateInfrastructure.levels.1.description'),
      icon: Cpu,
      color: "from-violet-500/20 to-violet-500/5",
      iconColor: "text-violet-500",
      image: "/infra_dedicated_server.jpg"
    },
    {
      level: 3,
      title: t('privateInfrastructure.levels.2.title'),
      description: t('privateInfrastructure.levels.2.description'),
      icon: Server,
      color: "from-fuchsia-500/20 to-fuchsia-500/5",
      iconColor: "text-fuchsia-500",
      image: "/infra_private_cloud.jpg"
    },
    {
      level: 4,
      title: t('privateInfrastructure.levels.3.title'),
      description: t('privateInfrastructure.levels.3.description'),
      icon: Network,
      color: "from-rose-500/20 to-rose-500/5",
      iconColor: "text-rose-500",
      image: "/infra_private_cdn.jpg"
    },
    {
      level: 5,
      title: t('privateInfrastructure.levels.4.title'),
      description: t('privateInfrastructure.levels.4.description'),
      icon: Building2,
      color: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-500",
      image: "/infra_on_premise.jpg"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/50 py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
          <div className="mx-auto max-w-[1600px] px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground uppercase">
              {t('privateInfrastructure.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              {t('privateInfrastructure.subtitle')}
            </p>
            <a 
              href="#form" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:brightness-110 transition-all hover:scale-105"
            >
              {t('privateInfrastructure.btnDiscuss')}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

        {/* The Progression Section */}
        <section className="py-24 bg-card/30">
          <div className="mx-auto max-w-[1600px] px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t('privateInfrastructure.levelsTitle')}</h2>
              <p className="text-lg text-muted-foreground">{t('privateInfrastructure.levelsSubtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-20 relative">
              {levels.map((lvl, index) => (
                <div key={lvl.level} className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-background backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:border-primary/50">
                  <div className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-md border border-border/50 rounded-full flex items-center justify-center font-bold text-foreground shadow-sm z-20">
                    {lvl.level}
                  </div>
                  
                  {/* Image Section */}
                  <div className="h-48 w-full relative overflow-hidden bg-muted">
                    <img src={lvl.image} alt={lvl.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${lvl.color} opacity-80`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                    <lvl.icon className={`absolute bottom-4 left-6 w-10 h-10 ${lvl.iconColor} drop-shadow-md z-10`} />
                  </div>
                  
                  {/* Text Section */}
                  <div className="p-6 pt-2 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">{lvl.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{lvl.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {t('privateInfrastructure.customiseTitle')}
              </h3>
              <p className="text-muted-foreground text-lg">
                {t('privateInfrastructure.customiseSubtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Requirements Form Section */}
        <section id="form" className="py-24 bg-background">
          <div className="mx-auto max-w-[1600px] px-6">
            <UniversalRequirementForm defaultGoal="Private Infrastructure" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
