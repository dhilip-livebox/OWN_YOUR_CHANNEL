import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, FileText, GraduationCap, Video, Wrench, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Free Resources — Ai ivb7" },
      { name: "description", content: "Software, guides, videos, docs and training for launching your Ai ivb7 channel." },
      { property: "og:title", content: "Free Resources — Ai ivb7" },
      { property: "og:description", content: "Everything you need to launch your channel — unlocked." },
    ],
  }),
  component: ResourcesPage,
});

const itemsKeys = [0, 1, 2, 3, 4, 5];
const itemIcons = [Download, FileText, Video, FileText, GraduationCap, Wrench];

function ResourcesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let registered = false;
    try {
      registered = localStorage.getItem("ailivetv:registered") === "1";
    } catch {}
    if (!registered) {
      navigate({ to: "/", hash: "register" });
    } else {
      setOk(true);
    }
  }, [navigate]);

  if (!ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        {t('resources.checking')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-[1600px] px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t('resources.backToHome')}
        </Link>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t('resources.title')}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {t('resources.subtitle')}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itemsKeys.map((idx) => {
            const Icon = itemIcons[idx];
            return (
              <div key={idx} className="card-surface card-surface-hover p-6">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/25">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{t(`resources.items.${idx}.title`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`resources.items.${idx}.body`)}</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:brightness-110"
                >
                  {t(`resources.items.${idx}.cta`)} →
                </button>
              </div>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
