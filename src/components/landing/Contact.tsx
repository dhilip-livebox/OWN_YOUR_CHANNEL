import { SectionHeading } from "./SectionHeading";
import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact-us" className="relative mx-auto max-w-[1200px] px-6 py-24">
      {/* Optional: subtle background glow for the section */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <SectionHeading
        eyebrow="Get in touch"
        title="We're here to help"
        subtitle="Have questions about launching your channel? Reach out to our team."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Phone Contact */}
        <a 
          href="tel:+919789978981" 
          className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border/40 bg-surface/30 p-10 shadow-sm backdrop-blur-sm transition-colors hover:border-primary"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Phone className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h3 className="font-display text-xl font-bold text-foreground">Call Us</h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              +91 97899 78981
            </p>
          </div>
        </a>

        {/* Email Contact */}
        <a 
          href="mailto:stanly@ivb.info" 
          className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border/40 bg-surface/30 p-10 shadow-sm backdrop-blur-sm transition-colors hover:border-primary"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h3 className="font-display text-xl font-bold text-foreground">Email Us</h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              stanly@ivb.info
            </p>
          </div>
        </a>

        {/* Location Contact */}
        <a 
          href="https://www.google.com/maps/search/?api=1&query=CD+Tech+Innovations+Egmore+Chennai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border/40 bg-surface/30 p-10 shadow-sm backdrop-blur-sm transition-colors hover:border-primary"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MapPin className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h3 className="font-display text-xl font-bold text-foreground">Visit Us</h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              CD Tech, Egmore
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
