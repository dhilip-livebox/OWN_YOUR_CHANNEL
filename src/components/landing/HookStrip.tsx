import { hooks } from "@/data/hooks";

export function HookStrip() {
  return (
    <section className="relative border-y border-border/60 bg-surface/40 py-10">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hooks.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="group flex items-center gap-3 rounded-full border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground/90 transition hover:border-primary/40 hover:text-foreground"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
