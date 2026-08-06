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
import { LogOut, Lock, ExternalLink, Save, Plus, Trash2, Phone, Mail, MapPin, Tag, CreditCard, Calendar, Package } from "lucide-react";
import {
  adminLogin,
  adminLogout,
  adminStatus,
  getLeadStats,
  getPricing,
  updatePricing,
  getCachedPricingSync,
  getConsultations,
  getOrders,
  PricingService,
  ConsultationLead,
  OrderRecord,
} from "@/lib/admin.functions";
import { computeAnnualPricing, percentFromAnnualPrice } from "@/lib/pricing";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
      <div className="mx-auto max-w-[1600px] px-6 py-10">
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

const TABS = [
  { key: "stats", label: "Registration Stats" },
  { key: "consultations", label: "Free Consultations" },
  { key: "orders", label: "Orders & Payments" },
  { key: "pricing", label: "Services" },
] as const;

function Dashboard() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("stats");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4 border-b border-border pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium transition-colors ${activeTab === tab.key ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && <StatsView />}
      {activeTab === 'consultations' && <ConsultationsView />}
      {activeTab === 'orders' && <OrdersView />}
      {activeTab === 'pricing' && <ServicesView />}
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

function formatShortDate(ts: string) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatFullDate(ts: string) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ConsultationsView() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["consultations"],
    queryFn: getConsultations,
    refetchInterval: 30_000,
  });
  const [selected, setSelected] = useState<ConsultationLead | null>(null);

  if (isLoading) return <div className="text-muted-foreground">Loading consultation requests…</div>;
  if (error || !data) {
    return (
      <div className="card-surface p-6 text-sm text-destructive">
        Couldn't load consultation requests. Check that <code>SHEETS_ENDPOINT</code> is set and
        the Apps Script is deployed as a Web App.
      </div>
    );
  }
  if (data.length === 0) {
    return <div className="card-surface p-6 text-sm text-muted-foreground">No free consultation requests yet.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((lead, i) => (
          <button
            key={i}
            onClick={() => setSelected(lead)}
            className="card-surface card-surface-hover p-5 text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-display text-base font-semibold text-foreground">{lead.name || "Unnamed"}</h4>
              <span className="whitespace-nowrap text-xs text-muted-foreground">{formatShortDate(lead.timestamp)}</span>
            </div>
            {lead.interest && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <Tag className="h-3 w-3" /> {lead.interest}
              </span>
            )}
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              {(lead.city || lead.country) && (
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {[lead.city, lead.state, lead.country].filter(Boolean).join(", ")}
                </p>
              )}
              {lead.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 shrink-0" /> {lead.phone}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name || "Unnamed"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <DetailRow icon={Calendar} label="Submitted" value={formatFullDate(selected.timestamp)} />
                <DetailRow icon={Phone} label="Phone" value={selected.phone} />
                <DetailRow icon={Mail} label="Email" value={selected.email} />
                <DetailRow
                  icon={MapPin}
                  label="Location"
                  value={[selected.city, selected.state, selected.country].filter(Boolean).join(", ")}
                />
                <DetailRow icon={Tag} label="Language" value={selected.language} />
                <DetailRow icon={Tag} label="Interest" value={selected.interest} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function OrdersView() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 30_000,
  });
  const [selected, setSelected] = useState<OrderRecord | null>(null);

  if (isLoading) return <div className="text-muted-foreground">Loading orders…</div>;
  if (error || !data) {
    return (
      <div className="card-surface p-6 text-sm text-destructive">
        Couldn't load orders. Check that <code>SHEETS_ENDPOINT</code> is set and
        the Apps Script is deployed as a Web App.
      </div>
    );
  }
  if (data.length === 0) {
    return <div className="card-surface p-6 text-sm text-muted-foreground">No orders yet.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((order, i) => (
          <button
            key={i}
            onClick={() => setSelected(order)}
            className="card-surface card-surface-hover p-5 text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-display text-base font-semibold text-foreground">{order.name || "Unnamed"}</h4>
              <span className="whitespace-nowrap text-xs text-muted-foreground">{formatShortDate(order.timestamp)}</span>
            </div>
            <p className="mt-2 font-display text-xl font-bold text-foreground">₹{order.amount.toLocaleString()}</p>
            {order.billingCycle && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
                <CreditCard className="h-3 w-3" /> {order.billingCycle}
              </span>
            )}
            <p className="mt-3 line-clamp-2 flex items-start gap-1.5 text-xs text-muted-foreground">
              <Package className="mt-0.5 h-3 w-3 shrink-0" /> {order.services || "—"}
            </p>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name || "Unnamed"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <DetailRow icon={Calendar} label="Ordered" value={formatFullDate(selected.timestamp)} />
                <DetailRow icon={Phone} label="Phone" value={selected.phone} />
                <DetailRow icon={Mail} label="Email" value={selected.email} />
                <DetailRow icon={Package} label="Services" value={selected.services} />
                <DetailRow icon={CreditCard} label="Billing cycle" value={selected.billingCycle} />
                <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{selected.subTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST</span>
                    <span>₹{selected.gst.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-border/60 pt-1 font-semibold">
                    <span>Total</span>
                    <span>₹{selected.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ServicesView() {
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

  const emptyDraft = (): PricingService => ({
    id: 0,
    name: "",
    description: "",
    monthlyPrice: null,
    monthlyOfferPrice: null,
    annualDiscountPercent: 0,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [draft, setDraft] = useState<PricingService>(emptyDraft());

  const openAddDialog = () => {
    setDraft(emptyDraft());
    setIsAddOpen(true);
  };

  const updateDraft = (field: keyof PricingService, value: any) => {
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const confirmAdd = () => {
    const nextId = services.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    setServices([...services, { ...draft, id: nextId }]);
    setIsAddOpen(false);
  };

  const cancelAdd = () => {
    setIsAddOpen(false);
  };

  const removeService = (index: number) => {
    const svc = services[index];
    if (!window.confirm(`Remove "${svc.name || "this service"}"? This can't be undone once you save.`)) return;
    setServices(services.filter((_, i) => i !== index));
  };

  if (isLoading) return <div className="text-muted-foreground">Loading services…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Services Configuration</h3>
        <div className="flex items-center gap-4">
          {saveStatus && <span className="text-sm text-primary">{saveStatus}</span>}
          <button
            onClick={openAddDialog}
            className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
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
                <th className="px-4 py-3 font-medium w-32">Monthly Default Price (₹)</th>
                <th className="px-4 py-3 font-medium w-32">Monthly Offer Price (₹)</th>
                <th className="px-4 py-3 font-medium w-32">Annual Default Price (₹)</th>
                <th className="px-4 py-3 font-medium w-48">Annual Offer Price (₹)</th>
                <th className="px-4 py-3 font-medium w-16">Actions</th>
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
                        placeholder="Service name"
                        className="w-full rounded border border-border/50 bg-background px-2 py-1 outline-none focus:border-primary/50"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={svc.description}
                        onChange={(e) => updateService(i, 'description', e.target.value)}
                        placeholder="Description"
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
                    <td className="px-4 py-3 text-muted-foreground">
                      {preview.annualRegularPrice === null ? "-" : `₹${preview.annualRegularPrice}/yr`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            value={preview.annualPrice ?? ""}
                            onChange={(e) => {
                              const typed = e.target.value ? Number(e.target.value) : (preview.annualRegularPrice ?? 0);
                              updateService(i, 'annualDiscountPercent', percentFromAnnualPrice(svc.monthlyPrice, typed));
                            }}
                            placeholder="N/A"
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
                        {preview.annualRegularPrice !== null && preview.discountPercent! > 0 && (
                          <div className="text-xs text-primary">Save ₹{preview.amountSaved}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeService(i)}
                        aria-label="Remove service"
                        title="Remove service"
                        className="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={(open) => !open && setIsAddOpen(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Service Name</label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => updateDraft('name', e.target.value)}
                placeholder="Service name"
                className="mt-1 w-full rounded border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <input
                type="text"
                value={draft.description}
                onChange={(e) => updateDraft('description', e.target.value)}
                placeholder="Description"
                className="mt-1 w-full rounded border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Monthly Default Price (₹)</label>
                <input
                  type="number"
                  value={draft.monthlyPrice === null ? "" : draft.monthlyPrice}
                  onChange={(e) => updateDraft('monthlyPrice', e.target.value ? Number(e.target.value) : null)}
                  placeholder="N/A"
                  className="mt-1 w-full rounded border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Monthly Offer Price (₹)</label>
                <input
                  type="number"
                  value={draft.monthlyOfferPrice === null ? "" : draft.monthlyOfferPrice}
                  onChange={(e) => updateDraft('monthlyOfferPrice', e.target.value ? Number(e.target.value) : null)}
                  placeholder="None"
                  className="mt-1 w-full rounded border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
            </div>
            {(() => {
              const draftPreview = computeAnnualPricing(draft);
              return (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Annual Default Price: {draftPreview.annualRegularPrice === null ? "-" : `₹${draftPreview.annualRegularPrice}/yr`}
                  </label>
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      value={draftPreview.annualPrice ?? ""}
                      onChange={(e) => {
                        const typed = e.target.value ? Number(e.target.value) : (draftPreview.annualRegularPrice ?? 0);
                        updateDraft('annualDiscountPercent', percentFromAnnualPrice(draft.monthlyPrice, typed));
                      }}
                      placeholder="N/A"
                      className="w-24 rounded border border-border/50 bg-background px-2 py-1.5 text-sm outline-none focus:border-primary/50"
                      title="Annual offer price"
                    />
                    <span className="text-xs text-muted-foreground">₹/yr offer,</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={Math.round(draft.annualDiscountPercent)}
                      onChange={(e) => updateDraft('annualDiscountPercent', e.target.value ? Number(e.target.value) : 0)}
                      className="w-16 rounded border border-border/50 bg-background px-2 py-1.5 text-sm outline-none focus:border-primary/50"
                      title="Discount percent"
                    />
                    <span className="text-xs text-muted-foreground">% off</span>
                  </div>
                  {draftPreview.annualRegularPrice !== null && draftPreview.discountPercent! > 0 && (
                    <p className="mt-1 text-xs text-primary">Save ₹{draftPreview.amountSaved}</p>
                  )}
                  {draftPreview.annualRegularPrice === null && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Set a monthly default price to compute the actual annual amount.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
          <DialogFooter>
            <button
              onClick={cancelAdd}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-destructive/40 hover:text-destructive"
            >
              Cancel
            </button>
            <button
              onClick={confirmAdd}
              disabled={!draft.name.trim()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
