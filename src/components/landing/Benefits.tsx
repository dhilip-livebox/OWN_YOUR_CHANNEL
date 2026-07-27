import { WifiOff, Power, Server, Globe, Wallet } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const items = [
  { icon: WifiOff, title: "No high-speed internet needed", body: "Your studio doesn't need a datacenter uplink. Push once — broadcast globally." },
  { icon: Power, title: "No computer left ON 24×7", body: "Programming runs on your broadcast servers, not your laptop." },
  { icon: Server, title: "Own your broadcasting servers", body: "You control the infrastructure. Your channel. Your rules." },
  { icon: Globe, title: "Reach viewers worldwide", body: "Every major platform, every screen — simultaneously." },
  { icon: Wallet, title: "Fraction of satellite TV cost", body: "Launch a full network without the seven-figure infrastructure bill." },
];

export function Benefits() {
  return (
    <section id="benefits" className="mx-auto max-w-[1280px] px-6 py-24">
      <SectionHeading
        eyebrow="Why your own channel"
        title="Everything a satellite network has. Almost none of the cost."
        subtitle="A full broadcast stack — automated, always-on, and owned by you."
      />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="card-surface card-surface-hover p-6">
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/25">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
