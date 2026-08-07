import { Link } from "@tanstack/react-router";
import { ChevronDown, Home, LogOut, Radio, User } from "lucide-react";
import { useEffect, useState } from "react";
import { customerLogout, getCustomerSession, SESSION_EVENT, type CustomerSession } from "@/lib/customer-auth.functions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const [session, setSession] = useState<CustomerSession | null>(null);

  useEffect(() => {
    const sync = () => setSession(getCustomerSession());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(SESSION_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SESSION_EVENT, sync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30 transition group-hover:bg-primary/25">
            <Radio className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            AI Live<span className="text-primary">TV</span>
          </span>
        </Link>

        {/* Absolutely centered relative to the whole header, independent of how wide the
            logo/actions on either side are — a flex-only layout would skew this off-center
            whenever those two sides have unequal widths. */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm text-muted-foreground lg:flex">
          <a href="/#hero" className="flex items-center gap-1.5 transition hover:text-foreground">
            <Home className="h-4 w-4" /> Home
          </a>
          <a href="/#benefits" className="transition hover:text-foreground">Why</a>
          <a href="/#platforms" className="transition hover:text-foreground">Platforms</a>
          <a href="/#journey" className="transition hover:text-foreground">Journey</a>
          <a href="/#channels" className="transition hover:text-foreground">Channels</a>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/purchase"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
            title="Services"
          >
            Services
          </Link>
          <a
            href="/#register"
            className="hidden whitespace-nowrap text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:inline"
          >
            Get Free Consultation
          </a>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border/60 py-1 pl-1 pr-3 text-sm font-semibold text-foreground outline-none transition hover:border-primary/40">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                  <User className="h-4 w-4" />
                </span>
                <span className="hidden max-w-[100px] truncate sm:inline">{session.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/requests">Request Status</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={customerLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3 text-sm font-semibold">
              <Link
                to="/account"
                search={{ tab: "login" }}
                className="hidden text-muted-foreground transition hover:text-foreground sm:inline"
              >
                Sign In
              </Link>
              <Link to="/account" search={{ tab: "register" }} className="text-primary transition hover:brightness-110">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
