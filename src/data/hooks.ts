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
    question: "faq.q1",
    answer: "faq.a1",
  },
  {
    icon: Clock,
    question: "faq.q2",
    answer: "faq.a2",
  },
  {
    icon: WifiOff,
    question: "faq.q3",
    answer: "faq.a3",
  },
  {
    icon: Bot,
    question: "faq.q4",
    answer: "faq.a4",
  },
  {
    icon: Share2,
    question: "faq.q5",
    answer: "faq.a5",
  },
  {
    icon: Tv,
    question: "faq.q6",
    answer: "faq.a6",
  },
  {
    icon: Server,
    question: "faq.q7",
    answer: "faq.a7",
  },
  {
    icon: Network,
    question: "faq.q8",
    answer: "faq.a8",
  },
  {
    icon: Wallet,
    question: "faq.q9",
    answer: "faq.a9",
  },
  {
    icon: Globe,
    question: "faq.q10",
    answer: "faq.a10",
  },
];
