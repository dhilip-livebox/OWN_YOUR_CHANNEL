import { platforms } from "@/data/platforms";
import { SectionHeading } from "./SectionHeading";

export function PlatformGrid() {
  return (
    <section id="platforms" className="relative border-y border-border/60 bg-surface/40 py-24">
      <div className="mx-auto max-w-[1600px] px-6">
        <SectionHeading
          align="center"
          eyebrow="Broadcast everywhere at once"
          title="One channel. Every screen. Simultaneously."
          subtitle="Push a single feed — arrive on every platform your audience already uses."
        />
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {platforms.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background/60 p-3 transition hover:border-accent/40 hover:bg-background"
            >
              <Icon className="h-6 w-6 text-accent transition group-hover:scale-110" />
              <span className="text-center text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
