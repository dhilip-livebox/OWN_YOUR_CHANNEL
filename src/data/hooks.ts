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

export type Hook = { icon: LucideIcon; text: string };

export const hooks: Hook[] = [
  { icon: Radio, text: "How to start your own Live TV channel" },
  { icon: Clock, text: "Broadcast 24×7 without keeping your computer ON" },
  { icon: WifiOff, text: "Broadcast without high-speed internet at your location" },
  { icon: Bot, text: "AI can automate your TV channel" },
  { icon: Share2, text: "Broadcast simultaneously to multiple platforms" },
  { icon: Tv, text: "Social media, OTT and local cable TV — together" },
  { icon: Server, text: "Own your own broadcasting servers" },
  { icon: Network, text: "Build your own television network" },
  { icon: Wallet, text: "Launch at a fraction of satellite TV cost" },
  { icon: Globe, text: "Reach viewers worldwide" },
];
