import type { LucideIcon } from "lucide-react";
import {
  Facebook,
  Youtube,
  Instagram,
  Tv,
  Smartphone,
  MonitorPlay,
  Cast,
  Globe,
  Radio,
  Antenna,
  Airplay,
  Router,
} from "lucide-react";

export type Platform = { icon: LucideIcon; label: string };

export const platforms: Platform[] = [
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
  { icon: Instagram, label: "Instagram" },
  { icon: MonitorPlay, label: "OTT Platforms" },
  { icon: Smartphone, label: "Mobile Apps" },
  { icon: Tv, label: "Android TV" },
  { icon: Cast, label: "Smart TV" },
  { icon: Airplay, label: "Apple TV" },
  { icon: Radio, label: "Roku" },
  { icon: Globe, label: "Websites" },
  { icon: Antenna, label: "Local Cable TV" },
  { icon: Router, label: "IPTV" },
];
