import { Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";


export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30 transition group-hover:bg-primary/25">
            <Radio className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            AI Live<span className="text-primary">TV</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/#benefits" className="transition hover:text-foreground">Why</a>
          <a href="/#platforms" className="transition hover:text-foreground">Platforms</a>
          <a href="/#journey" className="transition hover:text-foreground">Journey</a>
          <a href="/#videos" className="transition hover:text-foreground">Videos</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link 
            to="/purchase"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
            title="View Pricing"
          >
            View Pricing
          </Link>
          <a
            href="/#register"
            className="text-sm font-semibold text-muted-foreground transition hover:text-foreground whitespace-nowrap"
          >
            Get Free Consultation
          </a>
        </div>
      </div>
    </header>
  );
}
