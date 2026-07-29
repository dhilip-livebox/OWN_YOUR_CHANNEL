import { useState } from "react";
import { z } from "zod";
import { Check, Download, FileText, GraduationCap, Video, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const languages = [
  { value: "English", label: "English", active: true },
  { value: "Tamil", label: "Tamil (Coming Soon)", active: false },
  { value: "Hindi", label: "Hindi (Coming Soon)", active: false },
  { value: "Telugu", label: "Telugu (Coming Soon)", active: false },
  { value: "Kannada", label: "Kannada (Coming Soon)", active: false },
  { value: "Malayalam", label: "Malayalam (Coming Soon)", active: false },
];

const interestOptions = ["TV Channel", "OTT", "Streaming", "Broadcast Server", "Others"];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(4, "Phone is required").max(40),
  email: z.string().trim().email("Enter a valid email").max(200),
  country: z.string().trim().min(1, "Country is required").max(80),
  state: z.string().trim().min(1, "State is required").max(80),
  city: z.string().trim().min(1, "City is required").max(80),
  language: z.string().min(1),
  interest: z.array(z.string()).min(1, "Pick at least one interest"),
  interestOther: z.string().max(200).optional().default(""),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function Registration({ onRegistered }: { onRegistered: () => void }) {
  const [interest, setInterest] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  const toggle = (v: string) =>
    setInterest((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      country: String(fd.get("country") ?? ""),
      state: String(fd.get("state") ?? ""),
      city: String(fd.get("city") ?? ""),
      language: String(fd.get("language") ?? "English"),
      interest,
      interestOther: String(fd.get("interestOther") ?? ""),
    };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const fe: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setServerErr(json.error ?? "Submission failed. Please try again.");
      } else {
        try {
          localStorage.setItem("ailivetv:registered", "1");
          localStorage.setItem("ailivetv:email", parsed.data.email);
        } catch {}
        setDone(true);
        onRegistered();
      }
    } catch {
      setServerErr("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const perks = [
    { icon: Download, text: "Free broadcast & automation software" },
    { icon: FileText, text: "Step-by-step launch guides" },
    { icon: Video, text: "Full video library access" },
    { icon: FileText, text: "Docs, templates & checklists" },
    { icon: GraduationCap, text: "Training materials" },
    { icon: Wrench, text: "More tools added weekly" },
  ];

  return (
    <section
      id="register"
      className="relative mx-auto max-w-[1280px] scroll-mt-20 px-6 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-primary/25 bg-surface/60 p-6 sm:p-10"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 glow-gold opacity-40" />
          <div className="absolute -right-24 top-1/3 h-[380px] w-[380px] glow-blue opacity-30" />
        </div>

        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          {/* Left value column */}
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Free · Instant access
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              Register to get free consulting.
            </h2>
            <p className="mt-3 text-muted-foreground">
              One form. Everything you need to start broadcasting is unlocked the
              moment you submit.
            </p>
            <ul className="mt-6 space-y-3">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/25">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-foreground/90">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right form column */}
          <div>
            {done ? (
              <SuccessCard />
            ) : (
              <form onSubmit={onSubmit} className="card-surface p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Name" name="name" error={errors.name} />
                  <Field label="Phone number" name="phone" type="tel" error={errors.phone} />
                  <Field
                    label="Email address"
                    name="email"
                    type="email"
                    className="sm:col-span-2"
                    error={errors.email}
                  />
                  <Field label="Country" name="country" error={errors.country} />
                  <Field label="State" name="state" error={errors.state} />
                  <Field
                    label="City"
                    name="city"
                    className="sm:col-span-2"
                    error={errors.city}
                  />
                  <div className="sm:col-span-2">
                    <Label>Preferred language</Label>
                    <select
                      name="language"
                      defaultValue="English"
                      className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    >
                      {languages.map((l) => (
                        <option key={l.value} value={l.value} disabled={!l.active}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>What are you interested in?</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {interestOptions.map((opt) => {
                        const on = interest.includes(opt);
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => toggle(opt)}
                            className={
                              "rounded-full border px-3 py-1.5 text-xs font-medium transition " +
                              (on
                                ? "border-primary/60 bg-primary/15 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground")
                            }
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {errors.interest && (
                      <p className="mt-1.5 text-xs text-destructive">{errors.interest}</p>
                    )}
                    {interest.includes("Others") && (
                      <input
                        name="interestOther"
                        placeholder="Tell us more…"
                        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      />
                    )}
                  </div>
                </div>

                {serverErr && (
                  <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {serverErr}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_60%,transparent)] transition hover:brightness-110 disabled:opacity-60"
                >
                  {busy ? "Registering…" : "Register to get free consulting"}
                </button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  We'll never share your details. One-tap unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</label>;
}

function Field({
  label,
  name,
  type = "text",
  className = "",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        required
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="card-surface p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-live/15 text-live ring-1 ring-live/40">
        <Check className="h-7 w-7" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold text-foreground">You're in.</h3>
      <p className="mt-2 text-muted-foreground">
        Your free resources are unlocked. Head to the resources area to grab
        software, guides, videos and training.
      </p>
      <a
        href="/resources"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
      >
        Open free resources →
      </a>
    </div>
  );
}
