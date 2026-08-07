import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, CreditCard } from "lucide-react";
import { getCustomerSession, getMyOrders, type CustomerSession } from "@/lib/customer-auth.functions";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const current = getCustomerSession();
    if (!current) {
      navigate({ to: "/account", search: { redirect: "/" } });
      return;
    }
    setSession(current);
    setChecked(true);
  }, [navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", session?.email],
    queryFn: () => getMyOrders(),
    enabled: !!session?.email,
  });

  if (!checked || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Service Requests</h1>
            <p className="text-sm text-muted-foreground">View and track the status of your services.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="card-surface p-8 text-center text-sm text-muted-foreground">Loading requests...</div>
        ) : !orders || orders.length === 0 ? (
          <div className="card-surface p-8 text-center text-sm text-muted-foreground">You have no service requests yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {orders.map((order, i) => (
              <div key={i} className="card-surface p-5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-base font-semibold text-foreground">Order</h4>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 font-display text-xl font-bold text-foreground">₹{order.amount.toLocaleString()}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {order.billingCycle && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
                      <CreditCard className="h-3 w-3" /> {order.billingCycle}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    order.status === "Completed" ? "bg-green-500/10 text-green-500" :
                    order.status === "In Progress" ? "bg-amber-500/10 text-amber-500" :
                    "bg-blue-500/10 text-blue-500"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-4 line-clamp-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Package className="mt-0.5 h-3 w-3 shrink-0" /> {order.services || "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
