import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode, type ComponentType } from "react";
import { ArrowLeft, Lock, Mail, Phone, User as UserIcon } from "lucide-react";
import {
  getCustomerSession,
  updateProfile,
  changePassword,
  type CustomerSession,
} from "@/lib/customer-auth.functions";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const current = getCustomerSession();
    if (!current) {
      navigate({ to: "/account", search: { redirect: "/" } });
      return;
    }
    setSession(current);
    setChecked(true);
  }, [navigate]);

  if (!checked || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account details and password.</p>
          </div>
        </div>

        <div className="card-surface mb-6 p-8">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Account Details</h2>
          <ProfileForm session={session} />
        </div>

        <div className="card-surface p-8">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Change Password</h2>
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}

function ProfileForm({ session }: { session: CustomerSession }) {
  const [name, setName] = useState(session.name);
  const [email, setEmail] = useState(session.email);
  const [mobile, setMobile] = useState(session.mobile);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setBusy(true);
    const res = await updateProfile({ name, email, mobile });
    setBusy(false);
    if (res.ok) {
      setStatus("Saved!");
      setTimeout(() => setStatus(null), 3000);
    } else {
      setError(res.error ?? "Could not update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldInput label="Full Name" type="text" value={name} onChange={setName} icon={UserIcon} required />
      <FieldInput label="Email Address" type="email" value={email} onChange={setEmail} icon={Mail} required />
      <FieldInput label="Mobile Number" type="tel" value={mobile} onChange={setMobile} icon={Phone} required />
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex items-center gap-3">
        <SubmitButton busy={busy}>Save Changes</SubmitButton>
        {status && <span className="text-sm font-medium text-primary">{status}</span>}
      </div>
    </form>
  );
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    const res = await changePassword({ currentPassword, newPassword });
    setBusy(false);
    if (res.ok) {
      setStatus("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setStatus(null), 3000);
    } else {
      setError(res.error ?? "Could not update password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldInput label="Current Password" type="password" value={currentPassword} onChange={setCurrentPassword} icon={Lock} required />
      <FieldInput label="New Password" type="password" value={newPassword} onChange={setNewPassword} icon={Lock} placeholder="At least 8 characters" required minLength={8} />
      <FieldInput label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={Lock} required minLength={8} />
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex items-center gap-3">
        <SubmitButton busy={busy}>Update Password</SubmitButton>
        {status && <span className="text-sm font-medium text-primary">{status}</span>}
      </div>
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

function SubmitButton({ children, busy }: { children: ReactNode; busy: boolean }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
    >
      {busy ? "Please wait…" : children}
    </button>
  );
}
