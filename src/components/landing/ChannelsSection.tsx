import { useMemo, useState } from "react";
import { videos, videoCategories, type VideoItem } from "@/data/videos";
import { liveChannels } from "@/data/liveChannels";
import { SectionHeading } from "./SectionHeading";
import { LiveChannelPlayer } from "./LiveChannelPlayer";
import { PlayCircle, Lock } from "lucide-react";

export function ChannelsSection({ registered }: { registered: boolean }) {
  const [cat, setCat] = useState<(typeof videoCategories)[number]>("All");

  const filtered = useMemo(
    () => (cat === "All" ? videos : videos.filter((v) => v.category === cat)),
    [cat],
  );
  const featured = videos.filter((v) => v.featured);
  const latest = [...videos].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 6);

  return (
    <section id="channels" className="relative border-y border-border/60 bg-surface/40 py-24">
      <div className="mx-auto max-w-[1600px] px-6">
        {/* Live channels */}
        <div className="flex flex-wrap items-end justify-between gap-6">
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

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {liveChannels.map((channel) => (
            <LiveChannelPlayer key={channel.name} channel={channel} />
          ))}
        </div>

        {/* Tutorial video library */}
        <div className="mt-20 border-t border-border/60 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Video library"
              title="Fresh drops. Every day."
              subtitle="Setup walkthroughs, AI recipes, monetization playbooks — a new one lands daily."
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-live animate-live-pulse" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
              </span>
              {videos.length}+ videos · new videos added daily
            </div>
          </div>

          {/* Featured row */}
          <div className="mt-10">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Featured
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {featured.map((v) => (
                <VideoCard key={v.id} video={v} registered={registered} large />
              ))}
            </div>
          </div>

          {/* Filter + latest */}
          <div className="mt-14">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Latest
              </h3>
              <div className="flex flex-wrap gap-2">
                {videoCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={
                      "rounded-full border px-3 py-1 text-xs font-medium transition " +
                      (cat === c
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground")
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(cat === "All" ? latest : filtered).map((v) => (
                <VideoCard key={v.id} video={v} registered={registered} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoCard({
  video,
  registered,
  large = false,
}: {
  video: VideoItem;
  registered: boolean;
  large?: boolean;
}) {
  const onClick = (e: React.MouseEvent) => {
    if (registered) return;
    e.preventDefault();
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a
      href={registered ? "/resources" : "#register"}
      onClick={onClick}
      className="card-surface card-surface-hover group block overflow-hidden"
    >
      <div
        className={
          "relative flex items-center justify-center bg-gradient-to-br from-background via-surface to-background " +
          (large ? "aspect-[16/9]" : "aspect-video")
        }
      >
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(80%_80%_at_30%_20%,color-mix(in_oklch,var(--primary)_35%,transparent)_0%,transparent_60%),radial-gradient(80%_80%_at_80%_80%,color-mix(in_oklch,var(--accent)_30%,transparent)_0%,transparent_60%)]" />
        <PlayCircle
          className={
            "relative text-primary/90 transition group-hover:scale-110 " +
            (large ? "h-16 w-16" : "h-12 w-12")
          }
          strokeWidth={1.2}
        />
        {!registered && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur">
            <Lock className="h-3 w-3" /> Register to watch
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-md border border-border bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent backdrop-blur">
          {video.category}
        </span>
      </div>
      <div className="p-4">
        <h4 className="line-clamp-2 font-display text-base font-semibold text-foreground group-hover:text-primary">
          {video.title}
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(video.dateAdded).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </a>
  );
}
