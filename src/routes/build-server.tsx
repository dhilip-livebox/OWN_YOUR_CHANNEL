import { createFileRoute, redirect } from "@tanstack/react-router";
import { ServerBuilder } from "@/components/builder/ServerBuilder";
import { getCustomerSession } from "@/lib/customer-auth.functions";

export const Route = createFileRoute("/build-server")({
  beforeLoad: () => {
    if (!getCustomerSession()) {
      throw redirect({
        to: "/account",
        search: { tab: "login", redirect: "/build-server" },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Build Your Own Media Server - AI LiveTV" },
      {
        name: "description",
        content: "Choose the components you need. We will combine, configure and deploy them for you.",
      },
    ],
  }),
  component: BuildServerPage,
});

function BuildServerPage() {
  return <ServerBuilder />;
}
