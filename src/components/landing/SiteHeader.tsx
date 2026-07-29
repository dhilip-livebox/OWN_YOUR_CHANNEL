import { Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PricingTable } from "@/components/landing/PricingTable";

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
          <a href="#benefits" className="transition hover:text-foreground">Why</a>
          <a href="#platforms" className="transition hover:text-foreground">Platforms</a>
          <a href="#journey" className="transition hover:text-foreground">Journey</a>
          <a href="#videos" className="transition hover:text-foreground">Videos</a>
        </nav>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <button 
                title="Purchase Services"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
              >
                Purchase Services
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 h-[85vh] overflow-y-auto sm:rounded-xl">
              <PricingTable />
            </DialogContent>
          </Dialog>
          <a
            href="#register"
            className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            Register free
          </a>
        </div>
      </div>
    </header>
  );
}
