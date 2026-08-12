import { Link } from "@tanstack/react-router";
import { MonitorPlay, Share2, AppWindow, CalendarClock, Server, Building2, CheckCircle2 } from "lucide-react";

const cards = [
  {
    title: "Start My Own TV Channel",
    description: "For people who want a ready-to-use 24×7 TV channel.",
    icon: MonitorPlay,
    buttonText: "Start My Channel",
    to: "/start-channel",
    color: "from-cyan-500/20 to-cyan-500/5",
    logoGradient: "from-cyan-400 to-blue-600"
  },
  {
    title: "Stream Everywhere",
    description: "For customers wanting to send one live stream to multiple platforms.",
    list: ["Social Media", "Website", "Mobile App", "OTT", "IPTV", "Local TV"],
    icon: Share2,
    buttonText: "Explore Multi-Platform Streaming",
    searchCategory: "broadcast",
    color: "from-violet-500/20 to-violet-500/5",
    logoGradient: "from-violet-400 to-purple-600"
  },
  {
    title: "Launch My OTT / IPTV",
    description: "For customers wanting their own OTT, IPTV, subscriber platform, website or apps.",
    icon: AppWindow,
    buttonText: "Build My OTT / IPTV",
    searchCategory: "ott",
    color: "from-amber-500/20 to-amber-500/5",
    logoGradient: "from-amber-400 to-orange-500"
  },
  {
    title: "Automate My Channel",
    description: "For customers wanting scheduled videos, automated playout and 24×7 broadcasting.",
    icon: CalendarClock,
    buttonText: "Explore Automation",
    to: "/start-channel",
    color: "from-lime-500/20 to-lime-500/5",
    logoGradient: "from-lime-400 to-green-600"
  },
  {
    title: "Build My Own Streaming Server",
    description: "For technical users wanting RTMP, SRT, RTSP, Re-Streaming, Auto Streaming and other individual server components.",
    icon: Server,
    buttonText: "Build My Server",
    searchCategory: "server",
    color: "from-rose-500/20 to-rose-500/5",
    logoGradient: "from-rose-400 to-red-500"
  },
  {
    title: "Build a Private Media Network",
    description: "For enterprises, institutions and broadcasters wanting dedicated infrastructure, private cloud, CDN or on-premise deployment.",
    icon: Building2,
    buttonText: "Explore Private Infrastructure",
    searchCategory: "manual",
    color: "from-sky-500/20 to-sky-500/5",
    logoGradient: "from-sky-400 to-blue-600"
  }
];

export function ActionCards() {
  return (
    <section className="relative z-10 py-24 bg-background">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">What do you want to do?</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
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
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="mt-8 pt-4">
                <Link
                  to={card.to || "/services"}
                  search={card.searchCategory ? { category: card.searchCategory } : undefined}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-surface px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border transition-all hover:bg-muted hover:ring-foreground/20"
                >
                  {card.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
