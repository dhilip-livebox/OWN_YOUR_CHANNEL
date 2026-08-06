import { channels } from "@/data/channels";
import { SectionHeading } from "./SectionHeading";

export function SocialProof() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24">
      <SectionHeading
        eyebrow="Live in the wild"
        title="Channels already broadcasting with us."
        subtitle="A snapshot — real client channels replace these tiles as launches roll out."
      />
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {channels.map((c) => (
          <div key={c.name} className="card-surface card-surface-hover flex flex-col items-center gap-3 p-5 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-lg border border-border bg-background font-display text-lg font-bold text-primary">
              {c.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.genre}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-live animate-live-pulse" />
              LIVE on 4 platforms
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
