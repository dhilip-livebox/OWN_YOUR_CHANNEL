import { Radio, Facebook, Youtube, Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
              <Radio className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              AI Live<span className="text-primary">TV</span>
            </span>
          </Link>
          <div className="mt-5 max-w-md">
            <h4 className="font-bold text-foreground mb-2">{t('footer.engine')}</h4>
            <p className="text-sm font-medium text-primary mb-3">{t('footer.start')}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t('footer.explore')}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-foreground/80 hover:text-primary">{t('footer.home')}</Link></li>
            <li><Link to="/resources" className="text-foreground/80 hover:text-primary">{t('footer.resources')}</Link></li>
            <li><a href="/#register" className="text-foreground/80 hover:text-primary">{t('footer.register')}</a ></li>
            <li><a href="/#contact" className="text-foreground/80 hover:text-primary">{t('footer.contact')}</a ></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t('footer.connect')}
          </h4>
          <div className="mt-5 flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Facebook" className="hover:text-accent"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-accent"><Youtube className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-accent"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Ai ivb7. {t('footer.rights')}</p>
          <p>{t('footer.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
