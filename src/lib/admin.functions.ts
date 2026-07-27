import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { adminSessionConfig, type AdminSession } from "./admin-session.server";

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) return { ok: false as const, error: "ADMIN_PASSWORD is not configured" };
    if (!data?.password || !passwordMatches(data.password, expected)) {
      return { ok: false as const, error: "Incorrect password" };
    }
    const session = await useSession<AdminSession>(adminSessionConfig);
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(adminSessionConfig);
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(adminSessionConfig);
  return { unlocked: !!session.data.unlocked };
});

type DailyPoint = { date: string; count: number };
export type LeadStats = {
  total: number;
  today: number;
  week: number;
  month: number;
  daily: DailyPoint[];
};

function emptyStats(): LeadStats {
  const days: DailyPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    days.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  return { total: 0, today: 0, week: 0, month: 0, daily: days };
}

export const getLeadStats = createServerFn({ method: "GET" }).handler(async (): Promise<LeadStats> => {
  const session = await useSession<AdminSession>(adminSessionConfig);
  if (!session.data.unlocked) throw new Error("Unauthorized");

  const endpoint = process.env.SHEETS_ENDPOINT;
  if (!endpoint) return emptyStats();
  try {
    const res = await fetch(endpoint, { method: "GET" });
    if (!res.ok) return emptyStats();
    const json = (await res.json()) as Partial<LeadStats>;
    return {
      total: json.total ?? 0,
      today: json.today ?? 0,
      week: json.week ?? 0,
      month: json.month ?? 0,
      daily: json.daily?.length ? json.daily : emptyStats().daily,
    };
  } catch (err) {
    console.error("getLeadStats failed", err);
    return emptyStats();
  }
});
