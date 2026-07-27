import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(4).max(40),
  email: z.string().trim().email().max(200),
  country: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(80),
  city: z.string().trim().min(1).max(80),
  language: z.string().trim().min(1).max(40),
  interest: z.array(z.string().max(60)).min(1).max(10),
  interestOther: z.string().trim().max(200).optional().default(""),
});

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const endpoint = process.env.SHEETS_ENDPOINT;
        if (!endpoint) {
          return Response.json(
            { ok: false, error: "SHEETS_ENDPOINT not configured" },
            { status: 503 },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = leadSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
            { status: 400 },
          );
        }

        const payload = {
          ...parsed.data,
          interest:
            parsed.data.interest.join(", ") +
            (parsed.data.interestOther ? ` | Other: ${parsed.data.interestOther}` : ""),
        };

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            redirect: "follow",
          });
          if (!res.ok) {
            const text = await res.text();
            console.error("Sheets append failed", res.status, text);
            return Response.json(
              { ok: false, error: `Provider failed (${res.status})` },
              { status: 502 },
            );
          }
          return Response.json({ ok: true });
        } catch (err) {
          console.error("Sheets append error", err);
          return Response.json({ ok: false, error: "Network error" }, { status: 502 });
        }
      },
    },
  },
});
