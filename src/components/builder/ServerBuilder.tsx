import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import QRCode from "react-qr-code";
import { SiteHeader } from "../landing/SiteHeader";
import { SiteFooter } from "../landing/SiteFooter";
import { 
  Check, Plus, Trash2, Info, ArrowRight, ShieldCheck, Cpu,
  MonitorPlay, HardDrive, Cctv, Share2, Layers, Globe, Bot, 
  AppWindow, Repeat, BarChart3, Layout, Smartphone, Users, Tv, Mic
} from "lucide-react";
import { getServerComponents, getRequirementOptions } from "@/lib/admin.functions";
import { serverComponents as defaultServerComponents } from "@/data/serverComponents";
import { getCustomerSession } from "@/lib/customer-auth.functions";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function ServerBuilder() {
  const { t } = useTranslation();
  const getIconForComponent = (id: string) => {
    switch (id) {
      case 'S01': return MonitorPlay;
      case 'S02': return HardDrive;
      case 'S03': return Cctv;
      case 'S04': return Share2;
      case 'S05': return Layers;
      case 'S06': return Globe;
      case 'S07': return Bot;
      case 'S08': return AppWindow;
      case 'A01': return Repeat;
      case 'A02': return BarChart3;
      case 'A03': return Layout;
      case 'A04': return Smartphone;
      case 'A05': return Users;
      case 'A06': return Tv;
      case 'A07': return Mic;
      default: return Cpu;
    }
  };

  const navigate = useNavigate();
  const { data: serverComponentsData = [] } = useQuery({ 
    queryKey: ["serverComponents"], 
    queryFn: getServerComponents 
  });

  const { data: reqOptionsData } = useQuery({
    queryKey: ["requirementOptions"],
    queryFn: getRequirementOptions
  });

  // Default empty structure if backend fails to return anything
  const reqOptions = reqOptionsData || { bandwidth: [], storage: [], player: [] };

  // Merge the dynamically fetched data (names, prices) with the hardcoded dependency rules
  const componentsList = useMemo(() => {
    // If the backend has items, use them, otherwise use defaults.
    // We try to find the matching default item to carry over `requiredComponents` etc.
    const source = serverComponentsData.length > 0 ? serverComponentsData : defaultServerComponents;
    return source.map(remoteComp => {
      const defaultComp = defaultServerComponents.find(dc => dc.id === remoteComp.id) || {} as any;
      return {
        ...defaultComp,
        ...remoteComp, // remote overrides name, description, price
      };
    });
  }, [serverComponentsData]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedBandwidth, setSelectedBandwidth] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  
  // Checkout States
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'pay' | 'payment_details' | 'success'>('cart');
  const [paymentDetails, setPaymentDetails] = useState({ username: '', transactionId: '' });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const toggleComponent = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    
    if (next.size === 0) {
      setIsCheckoutMode(false);
      setSelectedBandwidth('');
      setSelectedStorage('');
      setSelectedPlayer('');
    }
    setSelectedIds(next);
  };

  const addComponent = (id: string) => {
    const next = new Set(selectedIds);
    next.add(id);
    setSelectedIds(next);
  };

  const removeComponent = (id: string) => {
    const next = new Set(selectedIds);
    next.delete(id);
    if (next.size === 0) {
      setIsCheckoutMode(false);
      setSelectedBandwidth('');
      setSelectedStorage('');
      setSelectedPlayer('');
    }
    setSelectedIds(next);
  };

  const missingRequirements = new Set<string>();
  const activeRecommendations = new Set<string>();

  selectedIds.forEach(id => {
    const comp = componentsList.find(c => c.id === id);
    if (comp) {
      comp.requiredComponents?.forEach((req: string) => {
        if (req === 'Bandwidth' && !selectedBandwidth) missingRequirements.add(req);
        else if (req === 'Storage' && !selectedStorage) missingRequirements.add(req);
        else if (req === 'Player' && !selectedPlayer) missingRequirements.add(req);
        else if (req !== 'Bandwidth' && req !== 'Storage' && req !== 'Player' && !selectedIds.has(req)) {
          missingRequirements.add(req);
        }
      });
      comp.optionalComponents?.forEach((rec: string) => {
        if (rec === 'Bandwidth' && !selectedBandwidth) activeRecommendations.add(rec);
        else if (rec === 'Storage' && !selectedStorage) activeRecommendations.add(rec);
        else if (rec === 'Player' && !selectedPlayer) activeRecommendations.add(rec);
        else if (rec !== 'Bandwidth' && rec !== 'Storage' && rec !== 'Player' && !selectedIds.has(rec)) {
          activeRecommendations.add(rec);
        }
      });
    }
  });

  const getCardStatus = (id: string) => {
    if (selectedIds.has(id)) return 'selected';
    if (missingRequirements.has(id)) return 'required';
    if (activeRecommendations.has(id)) return 'recommended';
    return 'default';
  };

  const selectedComponentsList = componentsList.filter(c => selectedIds.has(c.id));
  
  const bandwidthComp = reqOptions.bandwidth?.find(o => o.id === selectedBandwidth);
  const storageComp = reqOptions.storage?.find(o => o.id === selectedStorage);
  const playerComp = reqOptions.player?.find(o => o.id === selectedPlayer);

  const hasSelections = selectedIds.size > 0;
  
  const serverTotal = selectedComponentsList.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const optionsTotal = (Number(bandwidthComp?.price) || 0) + (Number(storageComp?.price) || 0) + (Number(playerComp?.price) || 0);
  const subTotalAmount = serverTotal + optionsTotal;
  const gstAmount = Math.round(subTotalAmount * 0.18);
  const totalAmount = subTotalAmount + gstAmount;
  const upiUrl = `upi://pay?pa=cdtech@hdfcbank&pn=CDTECH%20INNOVATIONS&am=${totalAmount}&cu=INR`;

  const goToAccount = () => navigate({ to: '/account', search: { tab: 'login' } });

  const handleCheckout = () => setCheckoutStep('pay');

  const handlePaymentSubmit = async () => {
    const session = getCustomerSession();
    if (!session) return;
    setIsSubmittingPayment(true);
    
    const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec";
    const data = {
      type: "purchase",
      name: session.name,
      email: session.email,
      phone: session.mobile,
      services: [
        ...selectedComponentsList.map(s => s.name),
        bandwidthComp ? `Bandwidth: ${bandwidthComp.name}` : null,
        storageComp ? `Storage: ${storageComp.name}` : null,
        playerComp ? `Player: ${playerComp.name}` : null
      ].filter(Boolean).join(", "),
      subTotal: subTotalAmount,
      gst: gstAmount,
      amount: totalAmount,
      billingCycle: "monthly",
      transactionId: paymentDetails.transactionId,
      accountName: paymentDetails.username,
    };

    try {
      await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setCheckoutStep('success');
    } catch (error) {
      console.error(error);
      alert("Failed to submit payment details.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-24 pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t('serverBuilder.title')}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('serverBuilder.desc')}
            </p>
          </div>

          {!isCheckoutMode && (
            <>
              {missingRequirements.size > 0 && (
                <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                  <Info className="text-destructive w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">{t('serverBuilder.missingTitle')}</h4>
                    <p className="text-sm text-destructive/80 mb-3">
                      {t('serverBuilder.missingDesc')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(missingRequirements).map(reqId => {
                        const reqName = componentsList.find(c => c.id === reqId)?.name || reqId;
                        return (
                          <button 
                            key={reqId} 
                            onClick={() => addComponent(reqId)}
                            className="text-xs bg-destructive text-destructive-foreground px-3 py-1 rounded-full hover:brightness-110 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> {t('serverBuilder.add')} {reqName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8 items-start mb-16">
                {/* LEFT SIDE: SERVICE CARDS (70%) */}
                <div className="w-full lg:w-[70%]">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {componentsList.map((comp, index) => {
                      const status = getCardStatus(comp.id);
                      const colorThemes = [
                        { color: "from-cyan-500/20 to-cyan-500/5", logoGradient: "from-cyan-400 to-blue-600" },
                        { color: "from-violet-500/20 to-violet-500/5", logoGradient: "from-violet-400 to-purple-600" },
                        { color: "from-amber-500/20 to-amber-500/5", logoGradient: "from-amber-400 to-orange-500" },
                        { color: "from-lime-500/20 to-lime-500/5", logoGradient: "from-lime-400 to-green-600" },
                        { color: "from-rose-500/20 to-rose-500/5", logoGradient: "from-rose-400 to-red-500" },
                        { color: "from-sky-500/20 to-sky-500/5", logoGradient: "from-sky-400 to-blue-600" },
                        { color: "from-pink-500/20 to-pink-500/5", logoGradient: "from-pink-400 to-rose-600" },
                        { color: "from-emerald-500/20 to-emerald-500/5", logoGradient: "from-emerald-400 to-teal-600" }
                      ];
                      const theme = colorThemes[index % colorThemes.length];

                      let borderClass = "border-border/50 hover:border-border";
                      let bgClass = `bg-gradient-to-br ${theme.color}`;
                      let iconBgClass = `bg-gradient-to-br ${theme.logoGradient} shadow-lg shadow-black/20 ring-1 ring-white/20`;
                      let badge = null;

                      if (status === 'selected') {
                        borderClass = "border-primary ring-1 ring-primary";
                        badge = <span className="inline-block align-middle ml-2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-sm shadow-sm">{t('serverBuilder.added')}</span>;
                      } else if (status === 'required') {
                        borderClass = "border-destructive ring-1 ring-destructive/50";
                        badge = <span className="inline-block align-middle ml-2 text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground px-2 py-0.5 rounded-sm animate-pulse shadow-sm">{t('serverBuilder.required')}</span>;
                      } else if (status === 'recommended') {
                        borderClass = "border-amber-500/50";
                        badge = <span className="inline-block align-middle ml-2 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-sm shadow-sm">{t('serverBuilder.recommended')}</span>;
                      }

                      return (
                        <div 
                          key={comp.id}
                          onClick={() => toggleComponent(comp.id)}
                          className={`relative p-5 rounded-2xl border ${borderClass} ${bgClass} cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 backdrop-blur-sm overflow-hidden`}
                        >
                          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}>
                            {(() => {
                              const IconComponent = getIconForComponent(comp.id);
                              return <IconComponent className="w-6 h-6 text-white drop-shadow-md" />;
                            })()}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-foreground mb-1 truncate">
                              {comp.name}
                              {badge}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                              {comp.description || t('serverBuilder.defaultDesc')}
                            </p>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border/50 sm:pl-4">
                            <span className="font-bold text-foreground whitespace-nowrap">₹{comp.price}</span>
                            {status === 'selected' ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }}
                                className="text-xs font-bold text-destructive hover:underline whitespace-nowrap"
                              >
                                {t('serverBuilder.remove')}
                              </button>
                            ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); addComponent(comp.id); }}
                                className={`text-xs font-bold rounded-lg px-4 py-2 transition-all shadow-sm whitespace-nowrap ${
                                  status === 'required' ? 'bg-destructive text-destructive-foreground hover:brightness-110' :
                                  status === 'recommended' ? 'bg-amber-500 text-white hover:brightness-110' :
                                  'bg-surface text-foreground ring-1 ring-inset ring-border hover:bg-muted hover:ring-foreground/20'
                                }`}
                              >
                                {t('serverBuilder.add')}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT SIDE: CONFIGURATION OPTIONS (30%) */}
                <div className="w-full lg:w-[30%] lg:sticky lg:top-28 self-start rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-6">{t('serverBuilder.hardwareNetwork')}</h3>
                  <div className="flex flex-col gap-5">
                    {/* Bandwidth */}
                    <div className={`p-4 rounded-xl border transition-colors ${missingRequirements.has('Bandwidth') ? 'border-destructive bg-destructive/5' : 'border-border'}`}>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t('serverBuilder.bandwidth')}</label>
                      {missingRequirements.has('Bandwidth') && (
                        <p className="text-[10px] text-destructive mb-3 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3" /> {t('serverBuilder.requiredForServer')}
                        </p>
                      )}
                      <select
                        value={selectedBandwidth}
                        onChange={e => setSelectedBandwidth(e.target.value)}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                      >
                        <option value="">{t('serverBuilder.selectBandwidth')}</option>
                        {reqOptions.bandwidth?.map(o => (
                          <option key={o.id} value={o.id}>{o.name} (₹{o.price})</option>
                        ))}
                      </select>
                    </div>

                    {/* Storage */}
                    <div className={`p-4 rounded-xl border transition-colors ${missingRequirements.has('Storage') ? 'border-destructive bg-destructive/5' : 'border-border'}`}>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t('serverBuilder.storage')}</label>
                      {missingRequirements.has('Storage') && (
                        <p className="text-[10px] text-destructive mb-3 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3" /> {t('serverBuilder.requiredForServer')}
                        </p>
                      )}
                      <select
                        value={selectedStorage}
                        onChange={e => setSelectedStorage(e.target.value)}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                      >
                        <option value="">{t('serverBuilder.selectStorage')}</option>
                        {reqOptions.storage?.map(o => (
                          <option key={o.id} value={o.id}>{o.name} (₹{o.price})</option>
                        ))}
                      </select>
                    </div>

                    {/* Player */}
                    <div className={`p-4 rounded-xl border transition-colors ${missingRequirements.has('Player') ? 'border-destructive bg-destructive/5' : 'border-border'}`}>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2">{t('serverBuilder.player')}</label>
                      {missingRequirements.has('Player') && (
                        <p className="text-[10px] text-destructive mb-3 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3" /> {t('serverBuilder.requiredForServer')}
                        </p>
                      )}
                      <select
                        value={selectedPlayer}
                        onChange={e => setSelectedPlayer(e.target.value)}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                      >
                        <option value="">{t('serverBuilder.selectPlayer')}</option>
                        {reqOptions.player?.map(o => (
                          <option key={o.id} value={o.id}>{o.name} (₹{o.price})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CHECKOUT MODE */}
          {isCheckoutMode && hasSelections && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-500 mb-16">
              <button 
                onClick={() => setIsCheckoutMode(false)}
                className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('serverBuilder.backToBuilder')}
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
                <div className="w-full rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-6 mb-6">
                    <h3 className="text-2xl font-bold text-foreground">{t('serverBuilder.orderSummary')}</h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                        {selectedIds.size + (bandwidthComp ? 1 : 0) + (storageComp ? 1 : 0) + (playerComp ? 1 : 0)} {t('serverBuilder.items')}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {selectedComponentsList.map(s => (
                      <li key={s.id} className="flex justify-between items-start text-base text-muted-foreground border-b border-border/30 pb-4">
                        <span className="pr-4">{s.name}</span>
                        <span className="font-semibold text-foreground whitespace-nowrap">₹{s.price}</span>
                      </li>
                    ))}
                    {bandwidthComp && (
                      <li className="flex justify-between items-start text-base text-muted-foreground border-b border-border/30 pb-4">
                        <span className="pr-4">Bandwidth: {bandwidthComp.name}</span>
                        <span className="font-semibold text-foreground whitespace-nowrap">₹{bandwidthComp.price}</span>
                      </li>
                    )}
                    {storageComp && (
                      <li className="flex justify-between items-start text-base text-muted-foreground border-b border-border/30 pb-4">
                        <span className="pr-4">Storage: {storageComp.name}</span>
                        <span className="font-semibold text-foreground whitespace-nowrap">₹{storageComp.price}</span>
                      </li>
                    )}
                    {playerComp && (
                      <li className="flex justify-between items-start text-base text-muted-foreground border-b border-border/30 pb-4">
                        <span className="pr-4">Player: {playerComp.name}</span>
                        <span className="font-semibold text-foreground whitespace-nowrap">₹{playerComp.price}</span>
                      </li>
                    )}
                  </ul>
                  <div className="mt-6 flex justify-between items-end border-t border-border/30 pt-4">
                    <p className="text-sm text-muted-foreground font-medium">{t('serverBuilder.subtotal')}</p>
                    <span className="text-base font-semibold text-foreground">₹{subTotalAmount}</span>
                  </div>
                  <div className="mt-2 flex justify-between items-end">
                    <p className="text-sm text-muted-foreground font-medium">{t('serverBuilder.gst')}</p>
                    <span className="text-base font-semibold text-foreground">₹{gstAmount}</span>
                  </div>
                  <div className="mt-4 flex justify-between items-end border-t border-border pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t('serverBuilder.totalDue')}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t('serverBuilder.includesTaxes')}</p>
                    </div>
                    <span className="text-3xl font-black text-foreground">₹{totalAmount}</span>
                  </div>
                </div>

                <div className="w-full rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-10 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    {checkoutStep === 'cart' && (
                      <div>
                        <h4 className="text-2xl font-bold text-foreground mb-2">{t('serverBuilder.confirmPay')}</h4>
                        <p className="text-sm text-muted-foreground mb-8">{t('serverBuilder.reviewDetails')}</p>
                        {(() => {
                          const session = getCustomerSession();
                          if (!session) {
                            return (
                              <div className="space-y-5">
                                <p className="text-sm text-muted-foreground">{t('serverBuilder.sessionExpired')}</p>
                                <button
                                  onClick={goToAccount}
                                  className="w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
                                >
                                  {t('serverBuilder.signIn')}
                                </button>
                              </div>
                            );
                          }
                          return (
                            <div className="space-y-5">
                              <div className="rounded-xl border border-border/50 bg-background/50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t('serverBuilder.nameLabel')}</p>
                                <p className="mt-0.5 text-base font-semibold text-foreground">{session.name}</p>
                              </div>
                              <div className="rounded-xl border border-border/50 bg-background/50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t('serverBuilder.emailLabel')}</p>
                                <p className="mt-0.5 text-base font-semibold text-foreground">{session.email}</p>
                              </div>
                              <button
                                onClick={handleCheckout}
                                className="mt-6 w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
                              >
                                {t('serverBuilder.proceedPayment')}
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    
                    {checkoutStep === 'pay' && (
                      <div className="bg-background/80 backdrop-blur border border-primary/20 p-8 rounded-2xl shadow-sm text-center">
                        <h4 className="text-2xl font-bold text-foreground mb-2">{t('serverBuilder.orderConfirmed')}</h4>
                        <p className="text-base text-muted-foreground mb-8">{t('serverBuilder.scanQr')} <strong className="text-foreground">₹{totalAmount}</strong></p>
                        
                        <div className="mx-auto bg-white p-6 rounded-2xl shadow-md inline-block border border-border">
                          <div className="mb-4 border-b border-border/50 pb-4">
                            <h5 className="font-bold text-lg text-slate-900 tracking-tight">CDTECH INNOVATIONS</h5>
                            <p className="text-xs text-slate-500 font-semibold tracking-widest mt-1">HDFC BANK • TID: 62289923</p>
                          </div>
                          <div className="bg-white mx-auto flex justify-center">
                            <QRCode value={upiUrl} size={220} />
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setCheckoutStep('payment_details')}
                          className="mt-6 w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
                        >
                          {t('serverBuilder.doneBtn')}
                        </button>
                      </div>
                    )}

                    {checkoutStep === 'payment_details' && (
                      <div className="bg-background/80 backdrop-blur border border-primary/20 p-8 rounded-2xl shadow-sm">
                        <h4 className="text-2xl font-bold text-foreground mb-4">{t('serverBuilder.paymentDetails')}</h4>
                        <p className="text-sm text-muted-foreground mb-6">{t('serverBuilder.provideDetails')}</p>
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t('serverBuilder.accountUsername')}</label>
                            <input
                              type="text"
                              value={paymentDetails.username}
                              onChange={e => setPaymentDetails({ ...paymentDetails, username: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-border/50 bg-background/50 p-4 text-base text-foreground outline-none focus:border-primary/50"
                              placeholder={t('serverBuilder.accountPlaceholder')}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t('serverBuilder.txnId')}</label>
                            <input
                              type="text"
                              value={paymentDetails.transactionId}
                              onChange={e => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-border/50 bg-background/50 p-4 text-base text-foreground outline-none focus:border-primary/50"
                              placeholder={t('serverBuilder.txnPlaceholder')}
                            />
                          </div>
                          <button
                            onClick={handlePaymentSubmit}
                            disabled={isSubmittingPayment || !paymentDetails.transactionId}
                            className="mt-6 w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110 disabled:opacity-50 transition-all"
                          >
                            {isSubmittingPayment ? t('serverBuilder.submitting') : t('serverBuilder.submitDetails')}
                          </button>
                        </div>
                      </div>
                    )}

                    {checkoutStep === 'success' && (
                      <div className="bg-background/80 backdrop-blur border border-primary/20 p-8 rounded-2xl shadow-sm text-center">
                        <div className="bg-green-500/10 text-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Check className="w-8 h-8" />
                        </div>
                        <h4 className="text-2xl font-bold text-foreground mb-2">{t('serverBuilder.thankYou')}</h4>
                        <p className="text-base text-muted-foreground">{t('serverBuilder.successMsg')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FLOATING CART BAR */}
      {!isCheckoutMode && hasSelections && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="bg-foreground text-background rounded-full shadow-2xl p-4 px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/20 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="bg-background/20 rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
                {selectedIds.size + (bandwidthComp ? 1 : 0) + (storageComp ? 1 : 0) + (playerComp ? 1 : 0)}
              </div>
              <div>
                <p className="text-sm font-medium opacity-80">{t('serverBuilder.selectedItems')}</p>
                <p className="text-xl font-bold">₹{subTotalAmount}</p>
                <p className="text-[10px] font-medium opacity-70 mt-0.5">{t('serverBuilder.gstAtCheckout')}</p>
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
              {t('serverBuilder.proceedCheckout')}
            </button>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
