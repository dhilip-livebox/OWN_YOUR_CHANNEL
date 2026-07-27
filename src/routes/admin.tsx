import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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
import { LogOut, Lock, ExternalLink } from "lucide-react";
import { adminLogin, adminLogout, adminStatus, getLeadStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Ai ivb7" },
      { name: "description", content: "Registration analytics for Ai ivb7." },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async () => ({ status: await adminStatus() }),
  component: AdminPage,
});

function AdminPage() {
  const { status } = Route.useLoaderData();
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(status.unlocked);

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
                await router.invalidate();
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
  const login = useServerFn(adminLogin);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setErr(null);
        setBusy(true);
        const password = new FormData(e.currentTarget).get("password") as string;
        const res = await login({ data: { password } });
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
  const logout = useServerFn(adminLogout);
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
  const fetchStats = useServerFn(getLeadStats);
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
