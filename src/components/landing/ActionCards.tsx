import { Link } from "@tanstack/react-router";
import { MonitorPlay, Share2, AppWindow, CalendarClock, Server, Building2, CheckCircle2, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ActionCards() {
  const { t } = useTranslation();

  const nonTechnicalCards = [
    {
      title: t('actionCards.startChannelTitle'),
      description: t('actionCards.startChannelDesc'),
      icon: MonitorPlay,
      buttonText: t('actionCards.startChannelBtn'),
      to: "/start-channel",
      color: "from-cyan-500/20 to-cyan-500/5",
      logoGradient: "from-cyan-400 to-blue-600"
    },
    {
      title: t('actionCards.multiPlatformTitle'),
      description: t('actionCards.multiPlatformDesc'),
      list: [t('actionCards.socialMedia'), t('actionCards.website'), t('actionCards.mobileApp'), t('actionCards.ott'), t('actionCards.iptv'), t('actionCards.localTv')],
      icon: Share2,
      buttonText: t('actionCards.multiPlatformBtn'),
      to: "/solutions/multi-platform-streaming",
      color: "from-violet-500/20 to-violet-500/5",
      logoGradient: "from-violet-400 to-purple-600"
    },
    {
      title: t('actionCards.ottTitle'),
      description: t('actionCards.ottDesc'),
      icon: AppWindow,
      buttonText: t('actionCards.ottBtn'),
      to: "/solutions/ott",
      color: "from-amber-500/20 to-amber-500/5",
      logoGradient: "from-amber-400 to-orange-500"
    },
    {
      title: t('actionCards.automationTitle'),
      description: t('actionCards.automationDesc'),
      icon: CalendarClock,
      buttonText: t('actionCards.automationBtn'),
      to: "/solutions/automated-streaming",
      color: "from-lime-500/20 to-lime-500/5",
      logoGradient: "from-lime-400 to-green-600"
    },
    {
      title: t('actionCards.privateNetworkTitle'),
      description: t('actionCards.privateNetworkDesc'),
      icon: Building2,
      buttonText: t('actionCards.privateNetworkBtn'),
      to: "/private-infrastructure",
      color: "from-sky-500/20 to-sky-500/5",
      logoGradient: "from-sky-400 to-blue-600"
    }
  ];

  const technicalCards = [
    {
      title: t('actionCards.customServerTitle'),
      description: t('actionCards.customServerDesc'),
      list: [t('actionCards.rtmp'), t('actionCards.reStreaming'), t('actionCards.transcoding'), t('actionCards.storage'), t('actionCards.bandwidth'), t('actionCards.players')],
      icon: Server,
      buttonText: t('actionCards.customServerBtn'),
      to: "/build-server",
      color: "from-rose-500/20 to-rose-500/5",
      logoGradient: "from-rose-400 to-red-500"
    }
  ];

  return (
    <section className="relative z-10 bg-background">
      {/* Important Sales Principle Banner */}
      <div className="bg-primary text-primary-foreground py-6 px-6 text-center shadow-lg relative z-20">
        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2">{t('actionCards.buyEverythingHeader')}</h3>
        <p className="font-medium opacity-90 max-w-4xl mx-auto">
          {t('actionCards.buyEverythingDesc')}
        </p>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 py-24">
        
        {/* NON-TECHNICAL JOURNEY */}
        <div className="mb-24">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl uppercase text-foreground mb-3">{t('actionCards.achieveHeader')}</h2>
            <p className="text-lg text-muted-foreground">{t('actionCards.achieveDesc')}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {nonTechnicalCards.map((card) => (
              <div 
                key={card.title}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${card.color} p-8 backdrop-blur-sm transition-all hover:border-border hover:shadow-xl`}
              >
                <div>
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.logoGradient} shadow-lg shadow-black/20 ring-1 ring-white/20`}>
                    <card.icon className="h-7 w-7 text-white drop-shadow-md" />
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold text-foreground">{card.title}</h3>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                  {card.list && (
                    <ul className="mb-8 grid grid-cols-2 gap-2">
                      {card.list.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="mt-8 pt-4">
                  <Link
                    to={card.to}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-surface px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border transition-all hover:bg-muted hover:ring-foreground/20"
                  >
                    {card.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNICAL JOURNEY */}
        <div className="pt-24 border-t border-border/50">
          <div className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider mb-4">
              <Wrench className="w-3.5 h-3.5" /> {t('actionCards.forTechnicalUsers')}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl uppercase text-foreground mb-3">{t('actionCards.technicalHeader')}</h2>
            <p className="text-lg text-muted-foreground">{t('actionCards.technicalDesc')}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {technicalCards.map((card) => (
              <div 
                key={card.title}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${card.color} p-8 backdrop-blur-sm transition-all hover:border-border hover:shadow-xl`}
              >
                <div>
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.logoGradient} shadow-lg shadow-black/20 ring-1 ring-white/20`}>
                    <card.icon className="h-7 w-7 text-white drop-shadow-md" />
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold text-foreground">{card.title}</h3>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                  {card.list && (
                    <ul className="mb-8 grid grid-cols-2 gap-2">
                      {card.list.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="mt-8 pt-4">
                  <Link
                    to={card.to}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-surface px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border transition-all hover:bg-muted hover:ring-foreground/20"
                  >
                    {card.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
