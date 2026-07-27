import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Hero } from "@/components/landing/Hero";
import { HookStrip } from "@/components/landing/HookStrip";
import { Benefits } from "@/components/landing/Benefits";
import { PlatformGrid } from "@/components/landing/PlatformGrid";
import { JourneyTimeline } from "@/components/landing/JourneyTimeline";
import { VideoLibrary } from "@/components/landing/VideoLibrary";
import { Registration } from "@/components/landing/Registration";
import { SocialProof } from "@/components/landing/SocialProof";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Live TV — Start Your Own AI-Powered 24×7 Broadcast Channel" },
      {
        name: "description",
        content:
          "Launch your own Live TV channel powered by AI. Broadcast simultaneously to Facebook, YouTube, OTT, IPTV and local cable — 24×7, without keeping your computer on.",
      },
      {
        property: "og:title",
        content: "AI Live TV — Start Your Own AI-Powered 24×7 Broadcast Channel",
      },
      {
        property: "og:description",
        content:
          "One channel. Every screen. AI-automated broadcasting to social, OTT, IPTV and cable.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    try {
      setRegistered(localStorage.getItem("ailivetv:registered") === "1");
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <HookStrip />
        <Benefits />
        <PlatformGrid />
        <JourneyTimeline />
        <VideoLibrary registered={registered} />
        <Registration onRegistered={() => setRegistered(true)} />
        <SocialProof />
      </main>
      <SiteFooter />
    </div>
  );
}
