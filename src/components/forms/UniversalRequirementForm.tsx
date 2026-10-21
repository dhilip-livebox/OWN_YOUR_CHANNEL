import { useState } from "react";
import { Check, Globe2, Building2, Send, Activity, Cpu, Network, Briefcase, Mail, MessageCircle, Flag, User } from "lucide-react";

export function UniversalRequirementForm({ 
  defaultGoal = "",
  defaultIndustry = ""
}: { 
  defaultGoal?: string,
  defaultIndustry?: string 
}) {
  const [formData, setFormData] = useState({
    goal: defaultGoal,
    platforms: [] as string[],
    audience: "",
    continuous: "",
    brand: "",
    infrastructure: "",
    name: "",
    company: "",
    country: "",
    whatsapp: "",
    email: "",
    description: defaultIndustry ? `I am looking for a solution in the ${defaultIndustry} industry. ` : ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const goals = [
    "Start TV Channel", "Live Stream", "Stream to Multiple Platforms", "OTT", "IPTV", 
    "Playout", "Private Streaming", "Dedicated Server", "Private Cloud", "Private CDN", 
    "On-Premise Server", "Educational Broadcasting", "Corporate Broadcasting", "Other"
  ];

  const platforms = [
    "Social Media", "Website", "Mobile App", "OTT", "IPTV", "Local TV", "Private Network", "Worldwide Internet", "Not Sure"
  ];

  const togglePlatform = (p: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) 
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Connect to Google Sheets or backend API
    const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec";
    
    try {
      await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          type: "universal_enquiry",
          ...formData,
          platforms: formData.platforms.join(", ")
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-center">
        <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Request Received!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for sharing your requirements. One of our media consultants will analyse your needs and contact you via WhatsApp or Email shortly with a recommended solution.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border shadow-xl p-6 md:p-10 max-w-4xl mx-auto text-left">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-3">TELL US WHAT YOU WANT TO ACHIEVE</h2>
        <p className="text-muted-foreground">We will design and recommend the exact infrastructure you need.</p>
      </div>

      <div className="space-y-12">
        {/* Section 1: The Goal */}
        <section>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-4 mb-6">
            <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            What do you want to do?
          </h3>
          <select 
            required
            value={formData.goal}
            onChange={(e) => setFormData({...formData, goal: e.target.value})}
            className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">-- Select your main goal --</option>
            {goals.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </section>

        {/* Section 2: Destinations */}
        <section>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-4 mb-6">
            <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Where do you want to broadcast? <span className="text-xs font-normal text-muted-foreground ml-2">(Select multiple)</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {platforms.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  formData.platforms.includes(p) 
                    ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: Audience & Scale */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Expected Audience</h3>
            <select 
              required
              value={formData.audience}
              onChange={(e) => setFormData({...formData, audience: e.target.value})}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select size</option>
              <option value="Under 100">Under 100</option>
              <option value="100-1,000">100–1,000</option>
              <option value="1,000-10,000">1,000–10,000</option>
              <option value="10,000+">10,000+</option>
              <option value="Not Sure">Not Sure</option>
            </select>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">24×7 Broadcasting?</h3>
            <div className="flex gap-4">
              {['Yes', 'No', 'Not Sure'].map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="radio" name="continuous" required value={opt} checked={formData.continuous === opt} onChange={e => setFormData({...formData, continuous: e.target.value})} className="accent-primary w-4 h-4" />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Own Brand Needed?</h3>
            <div className="flex gap-4">
              {['Yes', 'No', 'Not Sure'].map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="radio" name="brand" required value={opt} checked={formData.brand === opt} onChange={e => setFormData({...formData, brand: e.target.value})} className="accent-primary w-4 h-4" />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Infrastructure Preference */}
        <section>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-4 mb-6">
            <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            What type of infrastructure do you prefer?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'Cloud Account', icon: Globe2, desc: 'Shared resources, cost effective' },
              { id: 'Dedicated Server', icon: Cpu, desc: 'Your own isolated environment' },
              { id: 'Private Cloud', icon: Network, desc: 'Enterprise-grade scalable setup' },
              { id: 'My Own Premises', icon: Building2, desc: 'Hardware in your building' },
              { id: 'Not Sure – Please Recommend', icon: Activity, desc: 'Let our experts decide' }
            ].map(infra => (
              <label 
                key={infra.id}
                className={`relative flex flex-col p-5 rounded-2xl border cursor-pointer transition-all ${
                  formData.infrastructure === infra.id 
                    ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary' 
                    : 'border-border/60 bg-background hover:border-primary/50'
                }`}
              >
                <input type="radio" name="infrastructure" required value={infra.id} checked={formData.infrastructure === infra.id} onChange={e => setFormData({...formData, infrastructure: e.target.value})} className="sr-only" />
                <infra.icon className={`w-6 h-6 mb-3 ${formData.infrastructure === infra.id ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-semibold text-foreground mb-1">{infra.id}</span>
                <span className="text-xs text-muted-foreground">{infra.desc}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Section 5: Contact Details */}
        <section>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-4 mb-6">
            <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
            Your Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Company / Organisation (Optional)" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              <input required type="tel" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="relative md:col-span-2">
              <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input required type="text" placeholder="Country" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          
          <textarea 
            rows={4}
            placeholder="Tell us a bit more about what you want to build... (Optional)"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-background border border-border rounded-xl p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          ></textarea>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border/50 text-center">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-xl shadow-xl shadow-primary/20 hover:brightness-110 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none"
        >
          {isSubmitting ? 'SUBMITTING...' : 'GET MY RECOMMENDED SOLUTION'}
          {!isSubmitting && <Send className="w-5 h-5" />}
        </button>
        <p className="text-xs text-muted-foreground mt-4">We respect your privacy. No spam, ever.</p>
      </div>
    </form>
  );
}
