import { liveChannels } from "@/data/liveChannels";
import { SectionHeading } from "./SectionHeading";
import { LiveChannelPlayer } from "./LiveChannelPlayer";
import { useTranslation } from "react-i18next";

export function ChannelsSection({ registered }: { registered: boolean }) {
  const { t } = useTranslation();

  return (
    <section id="channels" className="relative border-y border-border/60 bg-surface/40 py-24">
      <div className="mx-auto max-w-[1600px] px-6">
        {/* Live channels Heading */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={t('channelsSection.eyebrow')}
            title={t('channelsSection.title')}
            subtitle={t('channelsSection.subtitle')}
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-live animate-live-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            {liveChannels.length} channels
          </div>
        </div>

        {/* Individual Channel Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {liveChannels.map((channel) => (
            <div 
              key={`grid-${channel.name}`}
              className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-lg transition-all duration-300"
            >
              <LiveChannelPlayer channel={channel} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
