import { createFileRoute } from '@tanstack/react-router';
import { ServerBuilderProvider, useServerBuilder } from '../context/ServerBuilderContext';
import { ServerBuilderLayout } from '../components/server-builder/Layout';
import { Step1Category } from '../components/server-builder/steps/Step1Category';
import { Step2ServerType } from '../components/server-builder/steps/Step2ServerType';
import { Step3Requirements } from '../components/server-builder/steps/Step3Requirements';
import { Step4Addons } from '../components/server-builder/steps/Step4Addons';
import { Step5Review } from '../components/server-builder/steps/Step5Review';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { getCustomerSession, SESSION_EVENT } from '@/lib/customer-auth.functions';
import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/services')({
  validateSearch: (search: Record<string, unknown>): { category?: string } => {
    return {
      category: search.category as string | undefined,
    }
  },
  component: ServerBuilderPage,
});

function Wizard() {
    const { state } = useServerBuilder();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!getCustomerSession());

    useEffect(() => {
        const handleSession = () => setIsLoggedIn(!!getCustomerSession());
        window.addEventListener(SESSION_EVENT, handleSession);
        return () => window.removeEventListener(SESSION_EVENT, handleSession);
    }, []);

    useEffect(() => {
        if (state.currentStep > 1 && !isLoggedIn) {
            navigate({ 
                to: '/account', 
                search: { 
                    redirect: '/services', 
                    tab: 'register',
                    category: state.mainCategory || undefined 
                } 
            });
        }
    }, [state.currentStep, isLoggedIn, navigate, state.mainCategory]);

    if (state.currentStep > 1 && !isLoggedIn) {
        return (
            <ServerBuilderLayout>
                <div className="flex h-[400px] items-center justify-center">
                    <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Redirecting to login...</p>
                    </div>
                </div>
            </ServerBuilderLayout>
        );
    }
    
    return (
        <ServerBuilderLayout>
            {state.currentStep === 1 && <Step1Category />}
            {state.currentStep === 2 && <Step2ServerType />}
            {state.currentStep === 3 && <Step3Requirements />}
            {state.currentStep === 4 && <Step4Addons />}
            {state.currentStep === 5 && <Step5Review />}
        </ServerBuilderLayout>
    );
}

function ServerBuilderPage() {
  const search = Route.useSearch();
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ServerBuilderProvider initialCategory={search.category}>
          <Wizard />
        </ServerBuilderProvider>
      </main>
      <SiteFooter />
    </div>
  );
}
