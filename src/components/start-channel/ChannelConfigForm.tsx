import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ChannelConfigForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    
    const fd = new FormData(e.currentTarget);
    const payload = {
      type: "channel_configuration",
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      country: String(fd.get("country") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      email: String(fd.get("email") ?? ""),
      intent: String(fd.get("intent") ?? ""),
      viewers: String(fd.get("viewers") ?? ""),
      hasContent: String(fd.get("hasContent") ?? ""),
    };

    try {
      const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec";
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-live/15 text-live ring-1 ring-live/40">
          <Check className="h-10 w-10" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-bold text-foreground">Configuration Request Received!</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Thank you! Our broadcast specialists will review your requirements and get back to you with a personalized, affordable configuration shortly.
        </p>
      </section>
    );
  }

  return (
    <section id="config-form" className="bg-background py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Fill out the form below and we'll craft the perfect channel configuration for you. No technical knowledge required.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-border bg-surface/50 p-6 sm:p-10 shadow-lg"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Full Name" name="name" required />
              <Field label="Company / Organisation" name="company" />
              <Field label="Email Address" name="email" type="email" required />
              <Field label="WhatsApp Number" name="whatsapp" type="tel" required />
              <Field label="Country" name="country" required />
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  What do you want to start?
                </label>
                <select
                  name="intent"
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="" disabled selected>Select an option...</option>
                  <option value="Live TV Channel">Live TV Channel</option>
                  <option value="OTT Platform">OTT Platform</option>
                  <option value="Local Cable Channel">Local Cable Channel</option>
                  <option value="Religious Broadcast">Religious Broadcast</option>
                  <option value="Community Media">Community Media</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Expected Viewers
                </label>
                <select
                  name="viewers"
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="" disabled selected>Select an option...</option>
                  <option value="Just starting (0 - 500)">Just starting (0 - 500)</option>
                  <option value="Growing (500 - 5,000)">Growing (500 - 5,000)</option>
                  <option value="Established (5,000 - 50,000)">Established (5,000 - 50,000)</option>
                  <option value="Large Scale (50,000+)">Large Scale (50,000+)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Do you already have content?
                </label>
                <select
                  name="hasContent"
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="" disabled selected>Select an option...</option>
                  <option value="Yes, plenty of videos ready">Yes, plenty of videos ready</option>
                  <option value="Working on it">Working on it</option>
                  <option value="No, just planning right now">No, just planning right now</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:brightness-110 disabled:pointer-events-none disabled:opacity-70"
              >
                {busy && <Loader2 className="h-5 w-5 animate-spin" />}
                GET MY CHANNEL CONFIGURATION
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
