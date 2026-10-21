import { Link } from "@tanstack/react-router";
import { ChevronDown, Home, LogOut, Radio, User, Menu, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30 transition group-hover:bg-primary/25">
            <Radio className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            AI Live<span className="text-primary">TV</span>
          </span>
        </Link>

        {/* Desktop Navigation (Centered Flex Layout) */}
        <nav className="hidden flex-1 items-center justify-center gap-4 lg:gap-6 text-[13px] font-semibold text-muted-foreground xl:flex px-4">
          <Link to="/" className="transition hover:text-foreground flex items-center gap-1"><Home className="h-4 w-4" /> {t('nav.home')}</Link>
          <Link to="/start-channel" className="transition hover:text-foreground">{t('nav.startChannel')}</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition hover:text-foreground outline-none">
              {t('nav.solutions')} <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[70vh] overflow-y-auto w-56">
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'live-tv-channel' }}>{t('solutions.liveTvChannel')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'multi-platform-streaming' }}>{t('solutions.multiPlatform')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'ott' }}>{t('solutions.ott')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'iptv' }}>{t('solutions.iptv')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'professional-playout' }}>{t('solutions.professionalPlayout')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'automated-streaming' }}>{t('solutions.automatedStreaming')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 're-streaming' }}>{t('solutions.reStreaming')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'srt-streaming' }}>{t('solutions.srtStreaming')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'rtsp-streaming' }}>{t('solutions.rtspStreaming')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'low-latency-streaming' }}>{t('solutions.lowLatency')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'radio-streaming' }}>{t('solutions.radioStreaming')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'mobile-broadcasting' }}>{t('solutions.mobileBroadcasting')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'multi-camera-production' }}>{t('solutions.multiCamera')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'local-tv-distribution' }}>{t('solutions.localTv')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'private-video-network' }}>{t('solutions.privateVideo')}</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/build-server" className="transition hover:text-foreground">{t('nav.serverBuilder')}</Link>
          <Link to="/private-infrastructure" className="transition hover:text-foreground">{t('nav.privateInfra')}</Link>
          <Link to="/industries" className="transition hover:text-foreground">{t('nav.industries')}</Link>
          <a href="/#contact" className="transition hover:text-foreground">{t('nav.contact')}</a>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {/* Language Switcher Desktop */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition hover:text-foreground outline-none">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{i18n.language?.substring(0, 2) || 'EN'}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ta')}>Tamil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('hi')}>Hindi</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('kn')}>Kannada</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('te')}>Telugu</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ml')}>Malayalam</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <a
            href="/#contact"
            className="hidden sm:inline-flex items-center rounded-md bg-primary px-5 py-2 text-[13px] font-bold text-primary-foreground shadow-sm transition hover:brightness-110"
          >
            {t('nav.talkToUs')}
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
                {t('nav.signIn')}
              </Link>
              <Link to="/account" search={{ tab: "register" }} className="hidden sm:inline-block text-primary transition hover:brightness-110">
                {t('nav.signUp')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="xl:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted outline-none">
                <Menu className="h-5 w-5 text-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuItem asChild><Link to="/">{t('nav.home')}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/start-channel">{t('nav.startChannel')}</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="font-semibold text-xs uppercase tracking-wider text-primary">{t('nav.solutions')}</DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'live-tv-channel' }}>{t('solutions.liveTvChannel')}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'ott' }}>{t('solutions.ott')}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/solutions/$id" params={{ id: 'multi-platform-streaming' }}>{t('solutions.multiPlatform')}</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/build-server">{t('nav.serverBuilder')}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/private-infrastructure">{t('nav.privateInfra')}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/industries">{t('nav.industries')}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><a href="/#contact">{t('nav.contact')}</a></DropdownMenuItem>
                
                {/* Language Switcher Mobile */}
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="font-semibold text-xs uppercase tracking-wider text-primary">{t('nav.chooseLanguage')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ta')}>Tamil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('hi')}>Hindi</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('kn')}>Kannada</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('te')}>Telugu</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ml')}>Malayalam</DropdownMenuItem>

                {!session && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link to="/account" search={{ tab: "login" }}>{t('nav.signIn')}</Link></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
