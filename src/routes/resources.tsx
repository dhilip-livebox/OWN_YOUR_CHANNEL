import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, FileText, GraduationCap, Video, Wrench, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";

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

const items = [
  { icon: Download, title: "Broadcast software", body: "Automation & streaming toolkit. Latest build.", cta: "Download" },
  { icon: FileText, title: "Launch guide (PDF)", body: "Zero-to-live in a single guided workflow.", cta: "Open PDF" },
  { icon: Video, title: "Video library", body: "Every tutorial we've ever produced.", cta: "Browse" },
  { icon: FileText, title: "Docs & templates", body: "Schedules, rate cards, contracts, checklists.", cta: "Get pack" },
  { icon: GraduationCap, title: "Training program", body: "Self-paced modules with quizzes.", cta: "Start" },
  { icon: Wrench, title: "AI recipes", body: "Prompt packs for programming and graphics.", cta: "View" },
];

function ResourcesPage() {
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
        Checking access…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Your free resources.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Everything is unlocked. Grab the software, follow a guide, or dive
          into training — new drops added weekly.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body, cta }) => (
            <div key={title} className="card-surface card-surface-hover p-6">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/25">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:brightness-110"
              >
                {cta} →
              </button>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
