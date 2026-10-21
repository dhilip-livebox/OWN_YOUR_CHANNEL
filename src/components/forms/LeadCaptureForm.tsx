import { useState } from "react";

interface LeadCaptureFormProps {
  onSuccess: () => void;
  defaultInterest?: string;
}

export function LeadCaptureForm({ onSuccess, defaultInterest = "" }: LeadCaptureFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      type: "lead_capture",
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      interest: formData.get("interest") as string,
      message: formData.get("message") as string,
    };

    try {
      const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec";
      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.ok) {
        onSuccess();
      } else {
        throw new Error("Failed to submit form.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
        <input 
          required 
          id="name" 
          name="name" 
          type="text" 
          className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
          <input 
            required 
            id="email" 
            name="email" 
            type="email" 
            className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
          <input 
            id="phone" 
            name="phone" 
            type="tel" 
            className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </div>
      </div>

      <input type="hidden" name="interest" value={defaultInterest} />

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">Additional Notes</label>
        <textarea 
          id="message" 
          name="message" 
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:brightness-110 transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
