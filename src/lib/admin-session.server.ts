// Server-only session config for admin gate.
import type { SessionConfig } from "@tanstack/react-start/server";

export type AdminSession = { unlocked?: boolean };

export const adminSessionConfig: SessionConfig = {
  password: process.env.SESSION_SECRET ?? "dev-only-insecure-fallback-please-set-SESSION_SECRET-000000",
  name: "ailivetv-admin",
  maxAge: 60 * 60 * 8, // 8 hours
  cookie: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
};
