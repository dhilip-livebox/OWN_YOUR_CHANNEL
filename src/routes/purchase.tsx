import { createFileRoute } from '@tanstack/react-router';
import { PricingTable } from '@/components/landing/PricingTable';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const Route = createFileRoute('/purchase')({
  component: PurchasePage,
});

function PurchasePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 py-12">
        <PricingTable />
      </main>
      <SiteFooter />
    </div>
  );
}
