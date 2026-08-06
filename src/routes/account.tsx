import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode, type ComponentType } from "react";
import { z } from "zod";
import { Lock, Mail, Phone, User as UserIcon, Radio } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  registerCustomer,
  loginCustomer,
  requestPasswordReset,
  verifyResetOtp,
  resetPassword,
} from "@/lib/customer-auth.functions";

const accountSearchSchema = z.object({
  redirect: z.enum(["/purchase", "/"]).optional(),
  tab: z.enum(["login", "register"]).optional(),
});

export const Route = createFileRoute("/account")({
  validateSearch: (search) => accountSearchSchema.parse(search),
  component: AccountPage,
});

function AccountPage() {
  const { redirect, tab } = Route.useSearch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">(tab ?? "login");

  const onAuthSuccess = () => {
    navigate({ to: redirect ?? "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
            <Radio className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            AI Live<span className="text-primary">TV</span>
          </span>
        </Link>

        <div className="card-surface p-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <LoginPanel onSuccess={onAuthSuccess} />
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <RegisterPanel onSuccess={onAuthSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function LoginPanel({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "forgot-email" | "forgot-otp" | "forgot-newpass">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await loginCustomer({ identifier, password, remember });
    setBusy(false);
    if (res.ok) onSuccess();
    else setError(res.error ?? "Login failed");
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await requestPasswordReset(resetEmail);
    setBusy(false);
    if (res.ok) setMode("forgot-otp");
    else setError(res.error ?? "Could not send reset code");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await verifyResetOtp(resetEmail, otp);
    setBusy(false);
    if (res.ok) setMode("forgot-newpass");
    else setError(res.error ?? "Incorrect code");
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const res = await resetPassword(resetEmail, otp, newPassword);
    setBusy(false);
    if (res.ok) {
      setMode("login");
      setIdentifier(resetEmail);
      setPassword("");
    } else {
      setError(res.error ?? "Could not reset password");
    }
  };

  if (mode === "forgot-email") {
    return (
      <form onSubmit={handleRequestReset} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter the email on your account and we'll send you a 6-digit code to reset your password.
        </p>
        <FieldInput label="Email" type="email" value={resetEmail} onChange={setResetEmail} icon={Mail} placeholder="you@example.com" required />
        {error && <ErrorText>{error}</ErrorText>}
        <SubmitButton busy={busy}>Send reset code</SubmitButton>
        <BackLink onClick={() => setMode("login")} />
      </form>
    );
  }

  if (mode === "forgot-otp") {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to <span className="text-foreground">{resetEmail}</span>.
        </p>
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {error && <ErrorText>{error}</ErrorText>}
        <SubmitButton busy={busy} disabled={otp.length < 6}>Verify code</SubmitButton>
        <BackLink onClick={() => setMode("forgot-email")} />
      </form>
    );
  }

  if (mode === "forgot-newpass") {
    return (
      <form onSubmit={handleSetNewPassword} className="space-y-4">
        <FieldInput label="New Password" type="password" value={newPassword} onChange={setNewPassword} icon={Lock} placeholder="At least 8 characters" required minLength={8} />
        <FieldInput label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={Lock} placeholder="Re-enter password" required minLength={8} />
        {error && <ErrorText>{error}</ErrorText>}
        <SubmitButton busy={busy}>Set new password</SubmitButton>
      </form>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <FieldInput label="Email or Mobile Number" type="text" value={identifier} onChange={setIdentifier} icon={Mail} placeholder="you@example.com or 98765 43210" required />
      <FieldInput label="Password" type="password" value={password} onChange={setPassword} icon={Lock} placeholder="••••••••" required />
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
          Remember Me
        </label>
        <button type="button" onClick={() => setMode("forgot-email")} className="font-medium text-primary hover:brightness-110">
          Forgot Password?
        </button>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <SubmitButton busy={busy}>Login</SubmitButton>
    </form>
  );
}

function RegisterPanel({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    const res = await registerCustomer({ name, email, mobile, password });
    setBusy(false);
    if (res.ok) onSuccess();
    else setError(res.error ?? "Registration failed");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldInput label="Full Name" type="text" value={name} onChange={setName} icon={UserIcon} placeholder="John Doe" required />
      <FieldInput label="Mobile Number" type="tel" value={mobile} onChange={setMobile} icon={Phone} placeholder="+91 98765 43210" required />
      <FieldInput label="Email Address" type="email" value={email} onChange={setEmail} icon={Mail} placeholder="you@example.com" required />
      <FieldInput label="Password" type="password" value={password} onChange={setPassword} icon={Lock} placeholder="At least 8 characters" required minLength={8} />
      <FieldInput label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={Lock} placeholder="Re-enter password" required minLength={8} />
      {error && <ErrorText>{error}</ErrorText>}
      <SubmitButton busy={busy}>Create Account</SubmitButton>
    </form>
  );
}

function FieldInput({
  label,
  type,
  value,
  onChange,
  icon: Icon,
  placeholder,
  required,
  minLength,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  icon: ComponentType<{ className?: string }>;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="relative mt-1.5">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="w-full rounded-md border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return <p className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">{children}</p>;
}

function SubmitButton({ children, busy, disabled }: { children: ReactNode; busy: boolean; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
    >
      {busy ? "Please wait…" : children}
    </button>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-xs font-medium text-muted-foreground hover:text-foreground">
      ← Back
    </button>
  );
}
