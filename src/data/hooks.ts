import type { LucideIcon } from "lucide-react";
import {
  Radio,
  Clock,
  WifiOff,
  Bot,
  Share2,
  Tv,
  Server,
  Network,
  Wallet,
  Globe,
} from "lucide-react";

export type FaqItem = { icon: LucideIcon; question: string; answer: string };

export const hooks: FaqItem[] = [
  {
    icon: Radio,
    question: "How do I start my own Live TV channel?",
    answer:
      "With Ai ivb7 you can set up your own branded Live TV channel in days, not months — we handle the servers, encoding and delivery so you can focus on content.",
  },
  {
    icon: Clock,
    question: "Can I broadcast 24×7 without keeping my computer on?",
    answer:
      "Yes. Your programming runs on our broadcast servers, not your laptop — schedule once and it keeps streaming 24×7 even when your computer is off.",
  },
  {
    icon: WifiOff,
    question: "Do I need high-speed internet to broadcast?",
    answer:
      "No. Our servers handle the heavy lifting, so even a modest internet connection at your location is enough to push your feed live.",
  },
  {
    icon: Bot,
    question: "Can AI really automate my TV channel?",
    answer:
      "Yes — AI can schedule, program and run your channel automatically: playlists, ad insertion, and fully automated Live TV without manual intervention.",
  },
  {
    icon: Share2,
    question: "Can I broadcast to multiple platforms at the same time?",
    answer:
      "Yes. One upload broadcasts simultaneously to Facebook, YouTube, OTT platforms, IPTV, websites and local cable — no repeated uploads needed.",
  },
  {
    icon: Tv,
    question: "Can I combine social media, OTT and local cable TV?",
    answer:
      "Yes — you're not limited to one distribution channel. Social media, OTT apps and local cable TV can all carry your channel from the same feed.",
  },
  {
    icon: Server,
    question: "Do I own the broadcasting servers?",
    answer:
      "Yes. You get your own dedicated broadcasting servers with full control — it's your infrastructure and your rules, not a shared or rented slot.",
  },
  {
    icon: Network,
    question: "Can I build my own television network?",
    answer:
      "Absolutely. With your own servers, control panel and branding, you can build a full multi-channel television network under your own name.",
  },
  {
    icon: Wallet,
    question: "How much cheaper is this than satellite TV?",
    answer:
      "A fraction of the cost — no transponder leasing or satellite uplink infrastructure required, just our AI-powered broadcast servers.",
  },
  {
    icon: Globe,
    question: "Can I reach viewers worldwide?",
    answer:
      "Yes. Once you're live, your channel reaches viewers on every major platform and screen — anywhere in the world with an internet connection.",
  },
];
