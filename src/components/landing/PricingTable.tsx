import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getPricing, getCachedPricingSync } from "@/lib/admin.functions";
import { computeAnnualPricing, getEffectivePrice, type BillingCycle } from "@/lib/pricing";
import { getCustomerSession } from "@/lib/customer-auth.functions";
import { loadCart, saveCart, clearCart } from "@/lib/cart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: servicesData } = useQuery({
    queryKey: ["pricing"],
    queryFn: getPricing,
    initialData: getCachedPricingSync,
    staleTime: 60_000,
  });

  const services = servicesData && servicesData.length > 0 ? servicesData : defaultServices;
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set(loadCart()?.selectedIds ?? []));
  const [cycle, setCycle] = useState<BillingCycle>(() => loadCart()?.cycle ?? "monthly");
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'pay' | 'payment_details' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ username: '', transactionId: '' });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  // Returning from /account with a saved cart + a session should land back in the checkout
  // panel, not the plain services table — otherwise the redirect round-trip loses the user's place.
  const [isCheckoutMode, setIsCheckoutMode] = useState(() => {
    const cart = loadCart();
    return !!(cart && cart.selectedIds.length > 0 && getCustomerSession());
  });

  useEffect(() => {
    saveCart({ selectedIds: Array.from(selectedIds), cycle });
  }, [selectedIds, cycle]);

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

  const goToAccount = () => navigate({ to: "/account", search: { redirect: "/purchase" } });

  const handleCheckout = () => {
    const session = getCustomerSession();
    if (!session) {
      goToAccount();
      return;
    }
    setCheckoutStep('pay');
  };

  const handlePaymentSubmit = async () => {
    setIsSubmittingPayment(true);
    const session = getCustomerSession();
    
    const selectedServicesList = services.filter(s => selectedIds.has(s.id)).map(s => s.name).join(", ");
    const payload = {
      type: 'checkout',
      name: session?.name || '',
      email: session?.email || '',
      phone: session?.mobile || '',
      services: selectedServicesList,
      subTotal: subTotalAmount,
      gst: gstAmount,
      amount: totalAmount,
      billingCycle: cycle,
      transactionId: paymentDetails.transactionId,
      accountName: paymentDetails.username
    };

    const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec";

    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).catch(() => {});

    clearCart();
    setIsSubmittingPayment(false);
    setCheckoutStep('success');
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
            {t('pricingTable.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t('pricingTable.subtitle')}
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
                  {t('pricingTable.monthly')}
                </ToggleGroupItem>
                <ToggleGroupItem value="annual" className="rounded-full px-5 py-2 text-sm font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  {t('pricingTable.yearly')}
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
                  onClick={() => {
                    if (!getCustomerSession()) {
                      goToAccount();
                      return;
                    }
                    setIsCheckoutMode(true);
                  }}
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
                {checkoutStep === 'cart' && (
                  <div>
                    <h4 className="text-2xl font-bold text-foreground mb-2">Confirm &amp; Pay</h4>
                    <p className="text-sm text-muted-foreground mb-8">Review your details below, then reveal the secure payment QR code.</p>
                    {(() => {
                      const session = getCustomerSession();
                      if (!session) {
                        // Shouldn't normally happen (checkout only opens with an active session),
                        // but handle a mid-checkout expiry gracefully instead of crashing.
                        return (
                          <div className="space-y-5">
                            <p className="text-sm text-muted-foreground">Your session has expired. Please sign in again to continue.</p>
                            <button
                              onClick={goToAccount}
                              className="w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
                            >
                              Sign In
                            </button>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-5">
                          <div className="rounded-xl border border-border/50 bg-background/50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</p>
                            <p className="mt-0.5 text-base font-semibold text-foreground">{session.name}</p>
                          </div>
                          <div className="rounded-xl border border-border/50 bg-background/50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</p>
                            <p className="mt-0.5 text-base font-semibold text-foreground">{session.email}</p>
                          </div>
                          <div className="rounded-xl border border-border/50 bg-background/50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mobile</p>
                            <p className="mt-0.5 text-base font-semibold text-foreground">{session.mobile}</p>
                          </div>
                          <button
                            onClick={handleCheckout}
                            className="mt-6 w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                          >
                            Proceed to Payment
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {checkoutStep === 'pay' && (
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
                    
                    <p className="mt-8 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">Please complete the payment and click Done to provide your transaction details.</p>
                    <button
                      onClick={() => setCheckoutStep('payment_details')}
                      className="mt-6 w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Done
                    </button>
                  </div>
                )}

                {checkoutStep === 'payment_details' && (
                  <div className="bg-background/80 backdrop-blur border border-primary/20 p-8 rounded-2xl shadow-sm animate-in zoom-in-95 fade-in duration-500">
                    <h4 className="text-2xl font-bold text-foreground mb-4">Payment Details</h4>
                    <p className="text-sm text-muted-foreground mb-6">Please provide your account name and transaction ID for verification.</p>
                    
                    <div className="space-y-4 text-left">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account Username</label>
                        <input
                          type="text"
                          value={paymentDetails.username}
                          onChange={e => setPaymentDetails({ ...paymentDetails, username: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-border/50 bg-background/50 p-4 text-base text-foreground outline-none focus:border-primary/50"
                          placeholder="Name on your account"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Transaction ID / UTR</label>
                        <input
                          type="text"
                          value={paymentDetails.transactionId}
                          onChange={e => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-border/50 bg-background/50 p-4 text-base text-foreground outline-none focus:border-primary/50"
                          placeholder="e.g. 123456789012"
                        />
                      </div>
                      <button
                        onClick={handlePaymentSubmit}
                        disabled={isSubmittingPayment || !paymentDetails.transactionId}
                        className="mt-6 w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {isSubmittingPayment ? 'Submitting...' : 'Submit Details'}
                      </button>
                    </div>
                  </div>
                )}

                {checkoutStep === 'success' && (
                  <div className="bg-background/80 backdrop-blur border border-primary/20 p-8 rounded-2xl shadow-sm text-center animate-in zoom-in-95 fade-in duration-500">
                    <div className="bg-green-500/10 text-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <h4 className="text-2xl font-bold text-foreground mb-2">Thank You!</h4>
                    <p className="text-base text-muted-foreground">Your payment details have been submitted. Our team will verify and activate your services shortly.</p>
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
