import { Radio, Facebook, Youtube, Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
              <Radio className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              AI Live<span className="text-primary">TV</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            The fastest way to launch and run your own AI-powered Live TV channel —
            broadcasting to social, OTT, IPTV and cable, simultaneously.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Explore
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-foreground/80 hover:text-primary">Home</Link></li>
            <li><Link to="/resources" className="text-foreground/80 hover:text-primary">Resources</Link></li>
            <li><a href="#register" className="text-foreground/80 hover:text-primary">Register</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Language
          </h4>
          <select
            defaultValue="English"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          >
            <option value="English">English</option>
            <option disabled>Tamil (Coming Soon)</option>
            <option disabled>Hindi (Coming Soon)</option>
            <option disabled>Telugu (Coming Soon)</option>
            <option disabled>Kannada (Coming Soon)</option>
            <option disabled>Malayalam (Coming Soon)</option>
          </select>
          <div className="mt-5 flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Facebook" className="hover:text-accent"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-accent"><Youtube className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-accent"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Ai ivb7. All rights reserved.</p>
          <p>Broadcast tech, reimagined.</p>
        </div>
      </div>
    </footer>
  );
}
