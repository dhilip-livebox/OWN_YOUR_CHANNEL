import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LogOut, Lock, ExternalLink, Save, Plus, Trash2 } from "lucide-react";
import { adminLogin, adminLogout, adminStatus, getLeadStats, getPricing, updatePricing, getCachedPricingSync, PricingService } from "@/lib/admin.functions";
import { computeAnnualPricing, percentFromAnnualPrice } from "@/lib/pricing";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      adminStatus().then((res) => {
        if (unlocked && !res.unlocked) {
          // If they were unlocked but are now expired, reload to show login
          window.location.reload();
        } else {
          setUnlocked(res.unlocked);
          setLoading(false);
        }
      });
    };
    
    checkStatus();
    // Check session status every 1 minute while the page is open
    const interval = setInterval(checkStatus, 60_000);
    return () => clearInterval(interval);
  }, [unlocked]);

  if (loading) return <div className="p-10 text-muted-foreground">Checking authentication...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Registration analytics · pulled live from Google Sheets
            </p>
          </div>
          {unlocked && (
            <LogoutButton
              onOut={async () => {
                setUnlocked(false);
                window.location.reload();
              }}
            />
          )}
        </div>
        {unlocked ? <Dashboard /> : <LoginForm onUnlock={() => setUnlocked(true)} />}
      </div>
    </div>
  );
}

function LoginForm({ onUnlock }: { onUnlock: () => void }) {
  const login = adminLogin;
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setErr(null);
        setBusy(true);
        const password = new FormData(e.currentTarget).get("password") as string;
        const res = await login({ password });
        setBusy(false);
        if (res.ok) onUnlock();
        else setErr(res.error ?? "Login failed");
      }}
      className="card-surface mx-auto max-w-md p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/25">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Enter admin password</h2>
          <p className="text-xs text-muted-foreground">Internal use only.</p>
        </div>
      </div>
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Password"
        required
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
      />
      {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
      >
        {busy ? "Unlocking…" : "Unlock"}
      </button>
    </form>
  );
}

function LogoutButton({ onOut }: { onOut: () => void }) {
  const logout = adminLogout;
  return (
    <button
      onClick={async () => {
        await logout();
        onOut();
      }}
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'stats' | 'pricing'>('stats');
  
  return (
    <div>
      <div className="mb-6 flex gap-4 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'stats' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Registration Stats
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'pricing' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Manage Pricing
        </button>
      </div>
      
      {activeTab === 'stats' ? <StatsView /> : <PricingView />}
    </div>
  );
}

function StatsView() {
  const fetchStats = getLeadStats;
  const { data, isLoading, error } = useQuery({
    queryKey: ["lead-stats"],
    queryFn: () => fetchStats(),
    refetchInterval: 30_000,
  });


  useEffect(() => {
    // no-op
  }, []);

  if (isLoading) {
    return <div className="text-muted-foreground">Loading stats…</div>;
  }
  if (error || !data) {
    return (
      <div className="card-surface p-6 text-sm text-destructive">
        Couldn't load stats. Check that <code>SHEETS_ENDPOINT</code> is set and
        the Apps Script is deployed as a Web App.
      </div>
    );
  }

  const cards = [
    { label: "Total", value: data.total },
    { label: "Today", value: data.today },
    { label: "This week", value: data.week },
    { label: "This month", value: data.month },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {c.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {c.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="card-surface mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Registrations · last 30 days</h3>
          <span className="text-xs text-muted-foreground">Auto-refreshes every 30s</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.daily} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="oklch(0.28 0.022 260)" strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "oklch(0.7 0.018 258)", fontSize: 11 }}
                tickFormatter={(d: string) => d.slice(5)}
                tickLine={false}
                axisLine={{ stroke: "oklch(0.28 0.022 260)" }}
              />
              <YAxis
                tick={{ fill: "oklch(0.7 0.018 258)", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "oklch(0.28 0.022 260)" }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "oklch(0.28 0.022 260 / 0.4)" }}
                contentStyle={{
                  background: "oklch(0.195 0.021 260)",
                  border: "1px solid oklch(0.28 0.022 260)",
                  borderRadius: 8,
                  color: "oklch(0.965 0.005 250)",
                }}
              />
              <Bar dataKey="count" fill="oklch(0.79 0.155 82)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-surface mt-6 flex items-start gap-4 p-5">
        <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div className="text-sm">
          <p className="font-semibold text-foreground">Export full lead list</p>
          <p className="mt-1 text-muted-foreground">
            Open the linked Google Sheet and choose <em>File → Download → Microsoft Excel (.xlsx)</em>.
            No custom export needed.
          </p>
        </div>
      </div>
    </>
  );
}

function PricingView() {
  const { data: initialData, isLoading } = useQuery({
    queryKey: ["admin-pricing"],
    queryFn: getPricing,
    initialData: getCachedPricingSync,
    staleTime: 60_000,
  });

  const [services, setServices] = useState<PricingService[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setServices(initialData);
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updatePricing(services);
      setSaveStatus("Saved!");
    } catch (err) {
      setSaveStatus("Failed to save: " + String(err));
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const updateService = (index: number, field: keyof PricingService, value: any) => {
    const next = [...services];
    next[index] = { ...next[index], [field]: value };
    setServices(next);
  };

  if (isLoading) return <div className="text-muted-foreground">Loading pricing…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Pricing Configuration</h3>
        <div className="flex items-center gap-4">
          {saveStatus && <span className="text-sm text-primary">{saveStatus}</span>}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Service Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium w-28">Monthly (₹)</th>
                <th className="px-4 py-3 font-medium w-28">Offer (₹)</th>
                <th className="px-4 py-3 font-medium w-64">Annual Pricing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map((svc, i) => {
                const preview = computeAnnualPricing(svc);
                return (
                  <tr key={svc.id}>
                    <td className="px-4 py-3 text-muted-foreground">{svc.id}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={svc.name}
                        onChange={(e) => updateService(i, 'name', e.target.value)}
                        className="w-full rounded border border-border/50 bg-background px-2 py-1 outline-none focus:border-primary/50"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={svc.description}
                        onChange={(e) => updateService(i, 'description', e.target.value)}
                        className="w-full rounded border border-border/50 bg-background px-2 py-1 outline-none focus:border-primary/50"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={svc.monthlyPrice === null ? "" : svc.monthlyPrice}
                        onChange={(e) => updateService(i, 'monthlyPrice', e.target.value ? Number(e.target.value) : null)}
                        className="w-full rounded border border-border/50 bg-background px-2 py-1 outline-none focus:border-primary/50"
                        placeholder="N/A"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={svc.monthlyOfferPrice === null ? "" : svc.monthlyOfferPrice}
                        onChange={(e) => updateService(i, 'monthlyOfferPrice', e.target.value ? Number(e.target.value) : null)}
                        className="w-full rounded border border-border/50 bg-background px-2 py-1 outline-none focus:border-primary/50"
                        placeholder="None"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {preview.annualRegularPrice === null ? (
                        <span className="text-xs text-muted-foreground">-</span>
                      ) : (
                        <div className="space-y-1">
                          {preview.discountPercent! > 0 && (
                            <div className="text-xs text-muted-foreground line-through">
                              ₹{preview.annualRegularPrice}/yr
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              value={preview.annualPrice!}
                              onChange={(e) => {
                                const typed = e.target.value ? Number(e.target.value) : preview.annualRegularPrice!;
                                updateService(i, 'annualDiscountPercent', percentFromAnnualPrice(svc.monthlyPrice, typed));
                              }}
                              className="w-20 rounded border border-border/50 bg-background px-2 py-1 outline-none focus:border-primary/50"
                              title="Discounted annual price"
                            />
                            <span className="text-xs text-muted-foreground">₹/yr</span>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={Math.round(svc.annualDiscountPercent)}
                              onChange={(e) => updateService(i, 'annualDiscountPercent', e.target.value ? Number(e.target.value) : 0)}
                              className="w-14 rounded border border-border/50 bg-background px-2 py-1 outline-none focus:border-primary/50"
                              title="Discount percent"
                            />
                            <span className="text-xs text-muted-foreground">% off</span>
                          </div>
                          {preview.discountPercent! > 0 && (
                            <div className="text-xs text-primary">Save ₹{preview.amountSaved}</div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
