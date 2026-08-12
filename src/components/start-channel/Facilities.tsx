import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const facilities = [
  "Professional Playout",
  "Video Scheduling",
  "24×7 Broadcasting",
  "Graphics / Titles / Scrolling",
  "Multi-Platform Streaming",
  "Website Streaming",
  "Mobile Viewing",
  "Social Media Distribution",
  "OTT / IPTV integration",
  "Upgradeable Bandwidth",
  "Upgradeable Storage",
];

export function Facilities() {
  return (
    <section className="bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left Column: Messaging */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              START SMALL. <br/>
              <span className="text-primary">UPGRADE WHEN YOU GROW.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              You don't need a massive budget to launch a professional broadcast channel. 
              Start with exactly what you need today, and seamlessly scale your infrastructure as your audience expands.
            </p>
            
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Starting Solution</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-foreground">₹499</span>
                <span className="text-sm text-muted-foreground">/ approx. per component</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Pricing scales dynamically depending on your specific configuration and requirements.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Facilities List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-border bg-card p-8 shadow-sm"
          >
            <h3 className="mb-6 text-xl font-bold text-foreground">Included & Available Facilities</h3>
            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {facilities.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
