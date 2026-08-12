import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { ChannelHero } from "@/components/start-channel/ChannelHero";
import { CustomerTypes } from "@/components/start-channel/CustomerTypes";
import { Facilities } from "@/components/start-channel/Facilities";
import { ChannelConfigForm } from "@/components/start-channel/ChannelConfigForm";

export const Route = createFileRoute("/start-channel")({
  head: () => ({
    meta: [
      { title: "Start Your Own 24x7 TV Channel - AI LiveTV" },
      {
        name: "description",
        content: "You bring the content. We provide the technology to broadcast it. Start affordably and upgrade later.",
      },
    ],
  }),
  component: StartChannelPage,
});

function StartChannelPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <ChannelHero />
        <CustomerTypes />
        <Facilities />
        <ChannelConfigForm />
      </main>
      <SiteFooter />
    </div>
  );
}
