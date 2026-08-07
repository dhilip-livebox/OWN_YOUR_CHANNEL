import { useEffect, useState } from "react";
import { liveChannels } from "@/data/liveChannels";
import { SectionHeading } from "./SectionHeading";
import { LiveChannelPlayer } from "./LiveChannelPlayer";

export function ChannelsSection({ registered }: { registered: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (liveChannels.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % liveChannels.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  const activeChannel = liveChannels[activeIndex];

  return (
    <section id="channels" className="relative border-y border-border/60 bg-surface/40 py-24">
      <div className="mx-auto max-w-[1600px] px-6">
        {/* Live channels Heading */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Live now"
            title="Channels streaming live right now"
            subtitle="Real channels, built and broadcasting on Ai ivb7 — watch a few of them live."
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-live animate-live-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            {liveChannels.length} channels
          </div>
        </div>

        {/* Primary Rotating Channel Player */}
        {activeChannel && (
          <div className="mb-14 overflow-hidden rounded-xl border border-border/60 bg-background shadow-2xl lg:mx-auto lg:max-w-5xl">
            <LiveChannelPlayer key={`hero-${activeChannel.name}`} channel={activeChannel} />
          </div>
        )}

        {/* Individual Channel Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {liveChannels.map((channel, idx) => (
            <div 
              key={`grid-${channel.name}`}
              className={`cursor-pointer transition-all duration-300 ${
                idx === activeIndex 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setActiveIndex(idx)}
            >
              <div className="pointer-events-none">
                <LiveChannelPlayer channel={channel} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
