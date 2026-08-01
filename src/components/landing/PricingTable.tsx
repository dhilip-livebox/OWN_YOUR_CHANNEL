import { Check } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useQuery } from "@tanstack/react-query";
import { getPricing, getCachedPricingSync } from "@/lib/admin.functions";
import { computeAnnualPricing, getEffectivePrice, type BillingCycle } from "@/lib/pricing";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const defaultServices = [
  {
    id: 1,
    name: "Website Hosting Server",
    description: "Server to host built-in Websites, Apps, Streaming & Storage",
    monthlyPrice: 299,
  },
  {
    id: 2,
    name: "Streaming Server",
    description: "Streaming Server to stream to 2 platforms",
    monthlyPrice: 499,
  },
  {
    id: 3,
    name: "Multi-Platform Broadcasting Server",
    description: "with your own logo and name insertion or slide insertion on video player with 1000 GB bandwidth every month. Get your own control panel for managing your server.",
    monthlyPrice: 499,
  },
  {
    id: 4,
    name: "Re-Streaming Server",
    description: "This server takes your feed and re-streams it to multiple servers.- you can also increase the bit rate - for example your internet is very low - this can take and stream even in 4k or full hd from the server.",
    monthlyPrice: 999,
  },
  {
    id: 5,
    name: "AI Automated Live Streaming for streaming",
    description: "without any system and High Speed internet - used for automated Live TV Channel, Automated Scheduled live Streaming all without local system device and internet",
    monthlyPrice: 1999,
  },
  {
    id: 6,
    name: "No Delay RTMP Server",
    description: "This Server is used for conducting Panel discussions",
    monthlyPrice: 899,
  },
  {
    id: 7,
    name: "SRT Server",
    description: "To Stream to Jio OTT Platform etc.",
    monthlyPrice: 899,
  },
  {
    id: 8,
    name: "RTSP Server",
    description: "To pull videos from IP Cameras",
    monthlyPrice: 899,
  },
  {
    id: 9,
    name: "Streaming Server to push Local TV and Broadcast Receiver box",
    description: "Streaming Server to push to Local MSO through Broadcast receiver Box.",
    monthlyPrice: 499,
  },
  {
    id: 10,
    name: "Playout Server Software",
    description: "with control for Local TV broadcast and TVs In Malls and other public places with control system",
    monthlyPrice: 499,
  },
  {
    id: 11,
    name: "Local TV Broadcasting Control Panel and Monitoring Server",
    description: "Monitoring Multiple Broadcast Receiver Boxes at various MSOs",
    monthlyPrice: 499,
  },
  {
    id: 12,
    name: "Live TV Websites for your Channel",
    description: "Live TV Website with your own Name and Logo",
    monthlyPrice: 299,
  },
  {
    id: 13,
    name: "Live TV Andorid App",
    description: "Android App - APK with your own Name and Logo",
    monthlyPrice: 499,
  },
  {
    id: 14,
    name: "Direct broadcast to Mobile App",
    description: "Direct to Mobile App with your own Name and logo - Broadcast direct to all Mobiles without any 3rd party controls",
    monthlyPrice: 899,
  },
  {
    id: 15,
    name: "Storage",
    description: "50 GB (Rs.50 per GB)",
    monthlyPrice: 500,
  },
  {
    id: 16,
    name: "Bandwidth",
    description: "3000 GB per month (Rs.1 per GB BW)",
    monthlyPrice: 500,
  },
  {
    id: 17,
    name: "Server Analytics",
    description: "Shows each viewer location, time, duration and the bandwidth used for viewing with IP address",
    monthlyPrice: null,
  },
  {
    id: 18,
    name: "Dual Control Panel",
    description: "3 levels of Controls",
    monthlyPrice: null,
  },
  {
    id: 19,
    name: "White labeled Video Player",
    description: "Have your own logo for each program or also have it as a slide in between programs",
    monthlyPrice: 499,
  },
  {
    id: 20,
    name: "IPTV & OTT Server",
    description: "",
    monthlyPrice: 7999,
  },
  {
    id: 21,
    name: "Transcoding Server",
    description: "",
    monthlyPrice: 5999,
  },
  {
    id: 22,
    name: "Radio Channel Single",
    description: "",
    monthlyPrice: 999,
  },
  {
    id: 23,
    name: "Radio Station Multiple",
    description: "",
    monthlyPrice: 4999,
  },
].map((s) => ({
  ...s,
  monthlyOfferPrice: null as number | null,
  annualDiscountPercent: 0,
}));

export function PricingTable() {
  const { data: servicesData } = useQuery({
    queryKey: ["pricing"],
    queryFn: getPricing,
    initialData: getCachedPricingSync,
    staleTime: 60_000,
  });
  
  const services = servicesData && servicesData.length > 0 ? servicesData : defaultServices;
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'register' | 'pay'>('cart');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (next.size === 0) setIsCheckoutMode(false);
      return next;
    });
    // Reset checkout step if selection changes
    setCheckoutStep('cart');
  };

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckoutError(null);
    setIsSubmitting(true);
    
    const fd = new FormData(e.currentTarget);
    const selectedServicesList = services.filter(s => selectedIds.has(s.id)).map(s => s.name).join(", ");
    
    const payload = {
      type: 'checkout',
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      services: selectedServicesList,
      subTotal: subTotalAmount,
      gst: gstAmount,
      amount: totalAmount,
      billingCycle: cycle
    };

    const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec";
    
    try {
      // Fire and forget to make the UI feel instant.
      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      }).catch(() => {});
      
      setCheckoutStep('pay');
    } catch (err) {
      setCheckoutError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServices = services.filter((s) => selectedIds.has(s.id));
  const subTotalAmount = selectedServices.reduce((acc, curr) => acc + (getEffectivePrice(curr, cycle) ?? 0), 0);
  const gstAmount = Math.round(subTotalAmount * 0.18);
  const totalAmount = subTotalAmount + gstAmount;

  const upiId = "cdtechinnovationspvt.62289923@hdfcbank";
  const merchantName = "CDTECH INNOVATIONS PVT LTD";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR`;

  return (
    <section id="pricing" className="bg-background py-8">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Services & Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            All our Servers are available on a yearly basis. Our Servers are highly cost effective — costing only Rs.299 to Rs.399 per month when taken as a package on a yearly basis.
          </p>
          {!isCheckoutMode && (
            <div className="mt-6 flex justify-center">
              <ToggleGroup
                type="single"
                value={cycle}
                onValueChange={(v) => v && setCycle(v as BillingCycle)}
                className="rounded-full border border-border bg-card p-1 shadow-sm"
              >
                <ToggleGroupItem value="monthly" className="rounded-full px-5 py-2 text-sm font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  Monthly
                </ToggleGroupItem>
                <ToggleGroupItem value="annual" className="rounded-full px-5 py-2 text-sm font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  Annual
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
        </div>

        <div className="mt-16 relative">

          {/* STEP 1: SERVICES TABLE */}
          {!isCheckoutMode && (
            <div className="w-full">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 w-full mb-24">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted/50 text-foreground">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">Sl.no.</th>
                    <th scope="col" className="px-6 py-4 font-semibold min-w-[200px]">Medium Package-1</th>
                    <th scope="col" className="px-6 py-4 font-semibold min-w-[300px]">Own your Own Server TV Channel (Dedicated)</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-right">Price (Rs.)</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {services.map((service) => {
                    const isSelected = selectedIds.has(service.id);
                    const effectivePrice = getEffectivePrice(service, cycle);
                    const annual = computeAnnualPricing(service);
                    const hasOffer =
                      cycle === "monthly" &&
                      service.monthlyOfferPrice != null &&
                      service.monthlyPrice != null &&
                      service.monthlyOfferPrice < service.monthlyPrice;
                    return (
                      <tr
                        key={service.id}
                        className={`transition-colors hover:bg-muted/30 ${isSelected ? 'bg-primary/5' : ''}`}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">{service.id}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{service.name}</td>
                        <td className="px-6 py-4">{service.description || "-"}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-foreground">
                          {effectivePrice != null ? (
                            <>
                              {hasOffer && (
                                <span className="mr-1.5 font-normal text-muted-foreground line-through">
                                  ₹{service.monthlyPrice}
                                </span>
                              )}
                              {cycle === "annual" && annual.discountPercent! > 0 && (
                                <span className="mr-1.5 font-normal text-muted-foreground line-through">
                                  ₹{annual.annualRegularPrice}
                                </span>
                              )}
                              ₹{effectivePrice}
                              {cycle === "annual" && annual.discountPercent! > 0 && (
                                <div className="mt-0.5 text-xs font-medium text-primary">
                                  Save {annual.discountPercent}% · ₹{annual.amountSaved} saved
                                </div>
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          {effectivePrice != null && (
                            <button
                              onClick={() => toggleSelection(service.id)}
                              className={`rounded-md px-4 py-2 text-xs font-semibold transition ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground shadow-sm hover:brightness-110'
                                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

          {/* FLOATING CART BAR (When in selection mode) */}
          {!isCheckoutMode && selectedIds.size > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
              <div className="bg-foreground text-background rounded-full shadow-2xl p-4 px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="bg-background/20 rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
                    {selectedIds.size}
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-80">Selected Services</p>
                    <p className="text-xl font-bold">₹{subTotalAmount}</p>
                    <p className="text-[10px] font-medium opacity-70 mt-0.5">+ 18% GST will be added at checkout</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCheckoutMode(true)}
                  className="bg-primary text-primary-foreground hover:brightness-110 px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FULL PAGE CHECKOUT */}
          {isCheckoutMode && selectedIds.size > 0 && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
              <button 
                onClick={() => setIsCheckoutMode(false)}
                className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Services
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
              
              {/* Left Column: Selected Services Summary */}
              <div className="w-full rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-6 mb-6">
                  <h3 className="text-2xl font-bold text-foreground">Order Summary</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted text-muted-foreground font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                      {cycle === "annual" ? "Annual" : "Monthly"}
                    </span>
                    <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">{selectedIds.size} items</span>
                  </div>
                </div>
                <ul className="space-y-4">
                  {selectedServices.map(s => (
                    <li key={s.id} className="flex justify-between items-start text-base text-muted-foreground border-b border-border/30 pb-4">
                      <span className="pr-4">{s.name}</span>
                      <span className="font-semibold text-foreground whitespace-nowrap">₹{getEffectivePrice(s, cycle)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex justify-between items-end border-t border-border/30 pt-4">
                  <p className="text-sm text-muted-foreground font-medium">Subtotal</p>
                  <span className="text-base font-semibold text-foreground">₹{subTotalAmount}</span>
                </div>
                <div className="mt-2 flex justify-between items-end">
                  <p className="text-sm text-muted-foreground font-medium">GST (18%)</p>
                  <span className="text-base font-semibold text-foreground">₹{gstAmount}</span>
                </div>
                <div className="mt-4 flex justify-between items-end border-t border-border pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Due</p>
                    <p className="text-xs text-muted-foreground mt-1">Includes all taxes and fees</p>
                  </div>
                  <span className="text-3xl font-black text-foreground">₹{totalAmount}</span>
                </div>
              </div>

              {/* Right Column: Form or QR Code */}
              <div className="w-full rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-10 shadow-lg relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10">
                {checkoutStep !== 'pay' ? (
                  <div>
                    <h4 className="text-2xl font-bold text-foreground mb-2">Your Details</h4>
                    <p className="text-sm text-muted-foreground mb-8">Please provide your details below to reveal the secure payment QR code.</p>
                    <form onSubmit={handleRegistration} className="space-y-5">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Full Name</label>
                        <input name="name" required className="mt-1.5 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-base outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email Address</label>
                        <input type="email" name="email" required className="mt-1.5 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-base outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mobile Number</label>
                        <input type="tel" name="phone" required className="mt-1.5 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-base outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm" placeholder="+91 XXXXX XXXXX" />
                      </div>
                      
                      {checkoutError && (
                        <div className="text-xs text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20">{checkoutError}</div>
                      )}
                      
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="mt-6 w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {isSubmitting ? 'Processing...' : 'Complete Order & Pay'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-background/80 backdrop-blur border border-primary/20 p-8 rounded-2xl shadow-sm text-center animate-in zoom-in-95 fade-in duration-500">
                    <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <h4 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h4>
                    <p className="text-base text-muted-foreground mb-8">Scan the QR below with any UPI app to securely pay <strong className="text-foreground">₹{totalAmount}</strong></p>
                    
                    <div className="mx-auto bg-white p-6 rounded-2xl shadow-md inline-block border border-border transition-transform hover:scale-105">
                      <div className="mb-4 border-b border-border/50 pb-4">
                        <h5 className="font-bold text-lg text-slate-900 tracking-tight">CDTECH INNOVATIONS</h5>
                        <p className="text-xs text-slate-500 font-semibold tracking-widest mt-1">HDFC BANK • TID: 62289923</p>
                      </div>
                      <div className="bg-white mx-auto flex justify-center">
                        <QRCode value={upiUrl} size={220} />
                      </div>
                    </div>
                    
                    <p className="mt-8 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">Your order details have been securely saved to our system. Our team will contact you shortly after successful payment.</p>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
