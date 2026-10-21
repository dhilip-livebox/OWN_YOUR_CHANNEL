import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { UniversalRequirementForm } from "@/components/forms/UniversalRequirementForm";
import { GraduationCap, HeartPulse, Building, Users, RadioTower, Landmark, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/industry/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id.toUpperCase().replace('-', ' ')} Media Solutions - CDTECH` },
      { name: "description", content: `Custom media infrastructure for the ${params.id} industry.` },
    ],
  }),
  component: IndustryDetailPage,
});

const industryData = {
  "education": {
    name: "EDUCATION",
    desc: "Schools, colleges, universities and training institutions.",
    icon: GraduationCap,
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
    applications: [
      { name: "Campus TV", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600" },
      { name: "Online classes", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600" },
      { name: "Lecture broadcasting", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600" },
      { name: "Recorded learning", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600" },
      { name: "Private IPTV", image: "https://images.unsplash.com/photo-1593789382576-54f489574d26?q=80&w=600" },
      { name: "Training channels", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600" },
      { name: "Events", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600" },
      { name: "Multi-campus broadcasting", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600" }
    ]
  },
  "healthcare": {
    name: "HEALTHCARE",
    desc: "Hospitals, medical colleges and healthcare networks.",
    icon: HeartPulse,
    color: "from-rose-500/20 to-rose-500/5",
    iconColor: "text-rose-500",
    applications: [
      { name: "Medical education", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600" },
      { name: "Training", image: "https://images.unsplash.com/photo-1551076805-e1869043e560?q=80&w=600" },
      { name: "Conferences", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600" },
      { name: "Internal broadcasting", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600" },
      { name: "Live procedures where appropriate", image: "https://images.unsplash.com/photo-1581056771107-11a4b09a1c58?q=80&w=600" },
      { name: "Patient information", image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=600" },
      { name: "Multi-location communication", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600" }
    ]
  },
  "corporate": {
    name: "CORPORATE",
    desc: "Corporate TV, internal communication and training.",
    icon: Building,
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-500",
    applications: [
      { name: "Corporate TV", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600" },
      { name: "Employee communication", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600" },
      { name: "Training", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600" },
      { name: "Product demonstrations", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600" },
      { name: "Events", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600" },
      { name: "Management communication", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600" },
      { name: "Multiple branch connectivity", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" },
      { name: "Private video network", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600" }
    ]
  },
  "ngo-community": {
    name: "NGO / RELIGIOUS / COMMUNITY",
    desc: "Community TV, religious events and global outreach.",
    icon: Users,
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-500",
    applications: [
      { name: "Live programmes", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600" },
      { name: "Community TV", image: "https://images.unsplash.com/photo-1531206715517-5c561081f1c0?q=80&w=600" },
      { name: "Events", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600" },
      { name: "Member communication", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600" },
      { name: "Mobile broadcasting", image: "https://images.unsplash.com/photo-1521939094609-93aba1af40d7?q=80&w=600" },
      { name: "Global audience reach", image: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?q=80&w=600" }
    ]
  },
  "media-broadcasters": {
    name: "MEDIA & BROADCASTERS",
    desc: "TV Channels, OTT, IPTV and distribution.",
    icon: RadioTower,
    color: "from-fuchsia-500/20 to-fuchsia-500/5",
    iconColor: "text-fuchsia-500",
    applications: [
      { name: "TV Channel", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=600" },
      { name: "OTT", image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=600" },
      { name: "IPTV", image: "https://images.unsplash.com/photo-1593789382576-54f489574d26?q=80&w=600" },
      { name: "Radio", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600" },
      { name: "Playout", image: "https://images.unsplash.com/photo-1516280440502-a16f6b1580b0?q=80&w=600" },
      { name: "Contribution", image: "https://images.unsplash.com/photo-1604754742465-b1a1c9053805?q=80&w=600" },
      { name: "Distribution", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600" },
      { name: "SRT", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600" },
      { name: "RTMP", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600" },
      { name: "RTSP", image: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8b?q=80&w=600" },
      { name: "Re-Streaming", image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=600" },
      { name: "Private CDN", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600" },
      { name: "Multiple Channels", image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=600" }
    ]
  },
  "government": {
    name: "GOVERNMENT / LARGE INSTITUTIONS",
    desc: "Private video infrastructure and controlled distribution.",
    icon: Landmark,
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
    applications: [
      { name: "Private video infrastructure", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600" },
      { name: "Controlled distribution", image: "https://images.unsplash.com/photo-1510511459019-5d55ad34f384?q=80&w=600" },
      { name: "Multi-location broadcasting", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600" },
      { name: "Dedicated servers", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600" },
      { name: "Private cloud", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600" },
      { name: "On-premise deployment", image: "https://images.unsplash.com/photo-1516280440502-a16f6b1580b0?q=80&w=600" },
      { name: "Customised architecture", image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=600" }
    ]
  }
};

function IndustryDetailPage() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const industry = industryData[id as keyof typeof industryData];

  if (!industry) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('industries.notFoundTitle')}</h1>
          <a href="/industries" className="text-primary hover:underline">{t('industries.viewAll')}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className={`relative overflow-hidden border-b border-border/50 py-24 lg:py-32 bg-gradient-to-b ${industry.color}`}>
          <div className="mx-auto max-w-[1600px] px-6 relative z-10 text-center flex flex-col items-center">
            <industry.icon className={`w-20 h-20 mb-8 ${industry.iconColor} drop-shadow-md`} />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground uppercase">
              {t(`industries.list.${id}.name`)} {t('industries.solutionsSuffix')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              {t(`industries.list.${id}.desc`)}
            </p>
          </div>
        </section>

        {/* Applications Section */}
        <section className="py-24 bg-card/30">
          <div className="mx-auto max-w-[1600px] px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">{t('industries.keyAppsTitle')}</h2>
              <p className="text-muted-foreground">{t('industries.keyAppsSubtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {industry.applications.map((app, index) => (
                <div key={index} className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 hover:border-primary/40">
                  <div className="h-44 w-full overflow-hidden bg-muted relative">
                    <img 
                      src={app.image} 
                      alt={app.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${industry.color} opacity-40 mix-blend-overlay`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
                    <CheckCircle2 className={`absolute bottom-4 left-5 w-7 h-7 ${industry.iconColor} drop-shadow-md`} />
                  </div>
                  <div className="p-5 pt-3 flex-1 flex items-center">
                    <span className="font-bold text-foreground text-lg leading-snug">{t(`industries.list.${id}.applications.${index}`)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Form Section */}
        <section id="form" className="py-24 bg-background border-t border-border/50">
          <div className="mx-auto max-w-[1600px] px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4 uppercase">{t('industries.tellUsTitle')}</h2>
            </div>
            <UniversalRequirementForm defaultIndustry={t(`industries.list.${id}.name`)} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
