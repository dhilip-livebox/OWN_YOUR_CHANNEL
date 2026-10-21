import { Link } from "@tanstack/react-router";
import { solutions } from "../../data/solutions";
import { SiteHeader } from "../landing/SiteHeader";
import { SiteFooter } from "../landing/SiteFooter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SolutionPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const solution = solutions.find((s) => s.id === id);

  if (!solution) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-foreground">{t('solutionsPage.notFound')}</h1>
            <p className="mt-4 text-muted-foreground">{t('solutionsPage.notFoundDesc')}</p>
            <Link to="/" className="mt-8 inline-block text-primary hover:underline">
              {t('solutionsPage.returnHome')}
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t(`solutionsData.${solution.id}.title`, { defaultValue: solution.title })}
            </h1>
          </div>

          <div className="space-y-12">
            <section className="card-surface p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">1</span>
                {t('solutionsPage.whatIsIt')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed pl-11">
                {t(`solutionsData.${solution.id}.whatIsIt`, { defaultValue: solution.whatIsIt })}
              </p>
            </section>

            <section className="card-surface p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">2</span>
                {t('solutionsPage.whoNeedsIt')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed pl-11">
                {t(`solutionsData.${solution.id}.whoNeedsIt`, { defaultValue: solution.whoNeedsIt })}
              </p>
            </section>

            <section className="card-surface p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">3</span>
                {t('solutionsPage.whatCanYouDo')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed pl-11">
                {t(`solutionsData.${solution.id}.whatCanYouDo`, { defaultValue: solution.whatCanYouDo })}
              </p>
            </section>

            <section className="card-surface p-8 rounded-2xl relative overflow-hidden group border border-primary/20">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">4</span>
                {t('solutionsPage.howWeProvide')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed pl-11">
                {t(`solutionsData.${solution.id}.howWeProvide`, { defaultValue: solution.howWeProvide })}
              </p>
            </section>
          </div>

          <div className="mt-16 bg-muted/30 border border-border rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.1)_0,transparent_100%)]"></div>
            <div className="relative z-10">
              <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                <div className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                  <span>{t('solutionsPage.needOnlyThis')} <strong>{t('solutionsPage.takeItIndependently')}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                  <span>{t('solutionsPage.needMore')} <strong>{t('solutionsPage.combineIt')}</strong></span>
                </div>
              </div>
              
              <Link 
                to="/build-server" 
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.5)]"
              >
                {t('solutionsPage.buildMySolution')} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
