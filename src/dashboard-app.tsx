import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LogOut, Lock, ExternalLink, Save, Plus, Trash2, Phone, Mail, MapPin, Tag, CreditCard, Calendar, Package, Hash, User } from "lucide-react";
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
  updateOrderStatus,
  updateLeadStatus,
  getServerComponents,
  updateServerComponents,
  getRequirementOptions,
  updateRequirementOptions,
  getCachedServerComponentsSync,
  getCachedRequirementOptionsSync,
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
  { key: "pricing", label: "Legacy Services" },
  { key: "server-builder", label: "Server Builder Config" },
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
      {activeTab === 'server-builder' && <ServerBuilderConfigView />}
    </div>
  );
}

function StatsView() {
  const { data: leadData, isLoading: leadsLoading, error: leadsError } = useQuery({
    queryKey: ["lead-stats"],
    queryFn: getLeadStats,
    refetchInterval: 30_000,
  });

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 30_000,
  });

  if (leadsLoading || ordersLoading) {
    return <div className="text-muted-foreground">Loading stats…</div>;
  }
  if (leadsError || !leadData || ordersError) {
    return (
      <div className="card-surface p-6 text-sm text-destructive">
        Couldn't load stats. Check that <code>SHEETS_ENDPOINT</code> is set and
        the Apps Script is deployed as a Web App.
      </div>
    );
  }

  // Compute Order Stats
  let revenueToday = 0;
  let revenueWeek = 0;
  let revenueMonth = 0;
  let revenueTotal = 0;
  let requestedCount = 0;
  let inProgressCount = 0;
  let completedCount = 0;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay()); // Sunday
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (orders) {
    orders.forEach(o => {
      const ts = new Date(o.timestamp);
      if (isNaN(ts.getTime())) return;
      
      const amount = o.amount || 0;
      revenueTotal += amount;
      if (ts >= startOfToday) revenueToday += amount;
      if (ts >= startOfWeek) revenueWeek += amount;
      if (ts >= startOfMonth) revenueMonth += amount;

      if (o.status === "Requested") requestedCount++;
      else if (o.status === "In Progress") inProgressCount++;
      else if (o.status === "Completed") completedCount++;
    });
  }

  const regCards = [
    { label: "Total Registrations", value: leadData.total.toLocaleString() },
    { label: "Today", value: leadData.today.toLocaleString() },
    { label: "This week", value: leadData.week.toLocaleString() },
    { label: "This month", value: leadData.month.toLocaleString() },
  ];

  const revCards = [
    { label: "Total Revenue", value: `₹${revenueTotal.toLocaleString()}` },
    { label: "Today", value: `₹${revenueToday.toLocaleString()}` },
    { label: "This week", value: `₹${revenueWeek.toLocaleString()}` },
    { label: "This month", value: `₹${revenueMonth.toLocaleString()}` },
  ];

  const statusCards = [
    { label: "Requested Orders", value: requestedCount, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "In Progress Orders", value: inProgressCount, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Completed Orders", value: completedCount, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Revenue Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground">Purchase Revenue</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {revCards.map((c) => (
            <div key={c.label} className="card-surface p-5 bg-primary/5 border border-primary/20">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                {c.label}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Order Status Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground">Order Status</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statusCards.map((c) => (
            <div key={c.label} className="card-surface p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {c.label}
                </p>
                <p className={`mt-2 font-display text-3xl font-bold ${c.color}`}>
                  {c.value.toLocaleString()}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${c.bg}`}>
                <Package className={`h-6 w-6 ${c.color}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registrations Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground">Registration Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {regCards.map((c) => (
            <div key={c.label} className="card-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {c.label}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">
                {c.value}
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
              <BarChart data={leadData.daily} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
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
      </section>

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
    </div>
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
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["consultations"],
    queryFn: getConsultations,
    refetchInterval: 30_000,
  });
  const [selected, setSelected] = useState<ConsultationLead | null>(null);
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const handleStatusUpdate = async (lead: ConsultationLead, newStatus: string) => {
    setUpdating(true);
    await updateLeadStatus(lead.timestamp, lead.email, newStatus);
    await queryClient.invalidateQueries({ queryKey: ["consultations"] });
    setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    setUpdating(false);
  };

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

  const filteredData = data.filter(lead => filterStatus === "All" || lead.status === filterStatus);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "New", "Contacted", "Follow Up", "Converted", "Not Interested"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filterStatus === status 
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredData.length === 0 ? (
        <div className="card-surface p-6 text-sm text-muted-foreground">No consultation requests found for this status.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredData.map((lead, i) => (
          <button
            key={i}
            onClick={() => setSelected(lead)}
            className="card-surface card-surface-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h4 className="font-display text-base font-semibold text-foreground truncate">{lead.name || "Unnamed"}</h4>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                    lead.status === "Converted" ? "bg-green-500/10 text-green-500" :
                    lead.status === "Contacted" || lead.status === "Follow Up" ? "bg-blue-500/10 text-blue-500" :
                    lead.status === "Not Interested" ? "bg-destructive/10 text-destructive" :
                    "bg-amber-500/10 text-amber-500"
                  }`}>
                    {lead.status}
                  </span>
                  {lead.language && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary/70">
                      {lead.language}
                    </span>
                  )}
                  {lead.interest && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                      <Tag className="h-3 w-3" /> {lead.interest}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {lead.phone && (
                  <p className="flex items-center gap-1.5 truncate">
                    <Phone className="h-3.5 w-3.5 shrink-0" /> {lead.phone}
                  </p>
                )}
                {(lead.city || lead.country) && (
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {[lead.city, lead.state, lead.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:items-end shrink-0">
               <span className="text-xs text-muted-foreground">{formatShortDate(lead.timestamp)}</span>
            </div>
          </button>
        ))}
      </div>
      )}

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
                
                <div className="pt-4 border-t border-border/60">
                  <h5 className="mb-2 text-sm font-semibold">Update Status</h5>
                  <div className="flex flex-wrap gap-2">
                    {["New", "Contacted", "Follow Up", "Converted", "Not Interested"].map((s) => (
                      <button
                        key={s}
                        disabled={updating || selected.status === s}
                        onClick={() => handleStatusUpdate(selected, s)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                          selected.status === s 
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                        } disabled:opacity-50`}
                      >
                        {s}
                      </button>
                    ))}
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

function OrdersView() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 30_000,
  });
  const [selected, setSelected] = useState<OrderRecord | null>(null);
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const handleStatusUpdate = async (order: OrderRecord, newStatus: string) => {
    setUpdating(true);
    await updateOrderStatus(order.timestamp, order.email, newStatus);
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    setUpdating(false);
  };

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

  const filteredData = data.filter(order => filterStatus === "All" || order.status === filterStatus);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Requested", "In Progress", "Completed"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filterStatus === status 
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredData.length === 0 ? (
        <div className="card-surface p-6 text-sm text-muted-foreground">No orders found for this status.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredData.map((order, i) => (
            <button
              key={i}
              onClick={() => setSelected(order)}
              className="card-surface card-surface-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h4 className="font-display text-base font-semibold text-foreground truncate">{order.name || "Unnamed"}</h4>
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                    order.status === "Completed" ? "bg-green-500/10 text-green-500" :
                    order.status === "In Progress" ? "bg-amber-500/10 text-amber-500" :
                    "bg-blue-500/10 text-blue-500"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm text-muted-foreground">
                  <Package className="mr-1 inline-block h-3.5 w-3.5" /> {order.services || "—"}
                </p>
                {order.transactionId && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    <Hash className="mr-1 inline-block h-3 w-3" /> Tx: {order.transactionId}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:items-end shrink-0">
                <p className="font-display text-lg font-bold text-foreground">₹{order.amount.toLocaleString()}</p>
                <div className="mt-1 flex items-center gap-2">
                  {order.billingCycle && (
                    <span className="inline-flex items-center gap-1 rounded text-xs font-medium capitalize text-muted-foreground">
                      <CreditCard className="h-3 w-3" /> {order.billingCycle}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground/50">•</span>
                  <span className="text-xs text-muted-foreground">{formatShortDate(order.timestamp)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

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
                <DetailRow icon={Hash} label="Transaction ID" value={selected.transactionId} />
                <DetailRow icon={User} label="Account Name" value={selected.accountName} />
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
                
                <div className="pt-4 border-t border-border/60">
                  <h5 className="mb-2 text-sm font-semibold">Update Status</h5>
                  <div className="flex gap-2">
                    {["Requested", "In Progress", "Completed"].map((s) => (
                      <button
                        key={s}
                        disabled={updating || selected.status === s}
                        onClick={() => handleStatusUpdate(selected, s)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                          selected.status === s 
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                        } disabled:opacity-50`}
                      >
                        {s}
                      </button>
                    ))}
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
    placeholderData: getCachedPricingSync,
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

function ServerBuilderConfigView() {
  const { data: serverComps, isLoading: isCompsLoading } = useQuery({
    queryKey: ["admin-server-comps"],
    queryFn: getServerComponents,
    placeholderData: getCachedServerComponentsSync,
    staleTime: 60_000,
  });

  const { data: reqOpts, isLoading: isReqLoading } = useQuery({
    queryKey: ["admin-req-opts"],
    queryFn: getRequirementOptions,
    placeholderData: getCachedRequirementOptionsSync,
    staleTime: 60_000,
  });

  const [components, setComponents] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (serverComps) setComponents(serverComps);
    if (reqOpts) setRequirements(reqOpts);
  }, [serverComps, reqOpts]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      if (components.length > 0) await updateServerComponents(components);
      if (requirements) await updateRequirementOptions(requirements);
      setSaveStatus("Saved!");
    } catch (err) {
      setSaveStatus("Failed to save: " + String(err));
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (isCompsLoading || isReqLoading) return <div className="text-muted-foreground">Loading configuration…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Server Builder Config</h3>
        <div className="flex items-center gap-4">
          {saveStatus && <span className="text-sm text-primary">{saveStatus}</span>}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="card-surface p-6">
        <p className="text-sm text-muted-foreground mb-4">
          This UI manages the <code>serverComponents</code> and <code>requirementOptions</code> arrays. 
          For complex changes like adding or deleting options, please use the Google Sheet directly.
        </p>
        
        <h4 className="font-semibold mt-6 mb-2">Server Components ({components?.length})</h4>
        <div className="space-y-2 max-h-[300px] overflow-auto border border-border rounded-md p-2">
          {components.map((c, i) => (
            <div key={i} className="flex justify-between items-center text-sm p-2 bg-muted/20 rounded">
              <div className="flex items-center gap-2">
                 <span className="font-mono text-xs text-muted-foreground w-8">{c.id}</span>
                 <strong>{c.name}</strong> 
                 <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c.category}</span>
              </div>
              <span>₹{c.price}</span>
            </div>
          ))}
        </div>

        <h4 className="font-semibold mt-6 mb-2">Requirements</h4>
        {requirements && Object.keys(requirements).map((key) => (
          <div key={key} className="mb-4">
            <h5 className="text-sm font-medium capitalize text-muted-foreground mb-1">{key}</h5>
            <div className="space-y-1">
              {requirements[key].map((r: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm p-1.5 bg-muted/10 rounded">
                  <span>{r.name}</span>
                  <span>₹{r.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
