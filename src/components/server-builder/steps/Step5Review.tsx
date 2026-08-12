import React, { useState } from 'react';
import { useServerBuilder } from '../../../context/ServerBuilderContext';
import { Check, MessageCircle, FileText, PhoneCall, ShoppingCart } from 'lucide-react';
import QRCode from "react-qr-code";
import { useNavigate } from "@tanstack/react-router";
import { getCustomerSession } from "@/lib/customer-auth.functions";

export const Step5Review = () => {
    const { state, calculateTotal, setStep, serverComponents, requirementOptions } = useServerBuilder();
    const navigate = useNavigate();

    const [checkoutStep, setCheckoutStep] = useState<'review' | 'pay' | 'payment_details' | 'success'>('review');
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({ username: '', transactionId: '' });

    if (!requirementOptions) {
        return <div className="text-muted-foreground p-8 text-center animate-pulse">Loading configuration...</div>;
    }

    const selectedServer = serverComponents.find(c => c.id === state.selectedServerId);
    const bandwidth = requirementOptions.bandwidth.find(b => b.id === state.bandwidthId);
    const player = requirementOptions.player.find(p => p.id === state.playerId);
    const storage = requirementOptions.storage.find(s => s.id === state.storageId);
    
    const selectedAddons = state.addons
        .map(id => serverComponents.find(c => c.id === id))
        .filter(c => c !== undefined) as typeof serverComponents;

    const baseTotal = calculateTotal();
    const discount = Math.floor(baseTotal * 0.15); // Example 15% bundle discount
    const finalPrice = baseTotal - discount;

    const subTotalAmount = finalPrice;
    const gstAmount = Math.round(subTotalAmount * 0.18);
    const totalAmount = subTotalAmount + gstAmount;

    const upiId = "cdtechinnovationspvt.62289923@hdfcbank";
    const merchantName = "CDTECH INNOVATIONS PVT LTD";
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR`;

    const handleCheckout = () => {
        const session = getCustomerSession();
        if (!session) {
            navigate({ to: "/account", search: { redirect: "/services" } as any });
            return;
        }
        setCheckoutStep('pay');
    };

    const handlePaymentSubmit = async () => {
        setIsSubmittingPayment(true);
        const session = getCustomerSession();
        
        const selectedServicesList = [
            selectedServer?.name,
            bandwidth && `${bandwidth.name} Bandwidth`,
            player?.name,
            storage && `${storage.name} Storage`,
            ...selectedAddons.map(a => a.name)
        ].filter(Boolean).join(", ");
    
        const payload = {
            type: 'checkout',
            name: session?.name || '',
            email: session?.email || '',
            phone: session?.mobile || '',
            services: `Custom Server: ${selectedServicesList}`,
            subTotal: subTotalAmount,
            gst: gstAmount,
            amount: totalAmount,
            billingCycle: 'monthly',
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
    
        setIsSubmittingPayment(false);
        setCheckoutStep('success');
    };

    const renderLineItem = (label: string, price: number | string) => (
        <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div className="flex items-center space-x-3 text-foreground">
                <Check className="w-4 h-4 text-primary" />
                <span>{label}</span>
            </div>
            <span className="font-medium text-muted-foreground">
                {typeof price === 'number' ? `₹${price}` : price}
            </span>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto pb-20">
            {checkoutStep === 'review' && (
                <>
                    <div className="text-center mb-12">
                        <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-primary to-blue-500 mb-6">
                            <div className="bg-card px-8 py-4 rounded-xl flex items-center justify-center space-x-3">
                                <Check className="w-8 h-8 text-primary" />
                                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase tracking-wider">
                                    YOUR CUSTOM STREAMING SERVER IS READY
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-8 md:p-10">
                            <h2 className="text-lg font-bold text-foreground mb-6 uppercase tracking-widest border-b border-border pb-4">Your Configuration</h2>
                            
                            <div className="space-y-1 mb-8">
                                {selectedServer && renderLineItem(selectedServer.name, selectedServer.price)}
                                {bandwidth && renderLineItem(`${bandwidth.name} Bandwidth`, bandwidth.price)}
                                {player && renderLineItem(player.name, player.price)}
                                {storage && renderLineItem(`${storage.name} Storage`, storage.price)}
                                
                                {selectedAddons.map(addon => (
                                    <div key={addon.id}>
                                        {renderLineItem(addon.name, addon.price)}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-border">
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span className="text-lg">Standard Price</span>
                                    <span className="text-xl line-through">₹{baseTotal}</span>
                                </div>
                                
                                <div className="flex justify-between items-center text-primary font-medium bg-primary/10 p-4 rounded-xl border border-primary/20">
                                    <span className="flex items-center"><Check className="w-5 h-5 mr-2" /> CUSTOM SERVER BUNDLE DISCOUNT</span>
                                    <span>-₹{discount}</span>
                                </div>
                                
                                <div className="flex justify-between items-end pt-4">
                                    <div>
                                        <span className="block text-sm text-muted-foreground font-bold uppercase tracking-widest mb-1">YOUR SPECIAL PRICE</span>
                                        <span className="block text-primary font-medium">You Save ₹{discount} Every Month</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl md:text-5xl font-extrabold text-foreground">
                                            ₹{finalPrice} <span className="text-xl text-muted-foreground font-bold">/ MO</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">+ 18% GST (₹{gstAmount}) will be added at checkout</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted p-6 md:p-10 border-t border-border flex justify-center">
                            <button 
                                onClick={handleCheckout}
                                className="flex items-center justify-center space-x-2 bg-primary hover:brightness-110 text-primary-foreground font-bold py-4 px-12 rounded-xl transition-all shadow-md w-full sm:w-auto"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>GET THE SERVICES</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button 
                            onClick={() => setStep(4)}
                            className="text-muted-foreground hover:text-foreground font-semibold transition-colors"
                        >
                            Back to Add-ons
                        </button>
                    </div>
                </>
            )}

            {checkoutStep === 'pay' && (
                <div className="max-w-xl mx-auto mt-10">
                    <div className="bg-card border border-border p-8 rounded-2xl shadow-sm text-center animate-in zoom-in-95 fade-in duration-500">
                        <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <h4 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h4>
                        <p className="text-base text-muted-foreground mb-8">Scan the QR below with any UPI app to securely pay <strong className="text-foreground">₹{totalAmount}</strong> (Incl. GST)</p>
                        
                        <div className="mx-auto bg-white p-6 rounded-2xl shadow-md inline-block border border-border transition-transform hover:scale-105">
                            <div className="mb-4 border-b border-border/50 pb-4">
                                <h5 className="font-bold text-lg text-slate-900 tracking-tight">CDTECH INNOVATIONS</h5>
                                <p className="text-xs text-slate-500 font-semibold tracking-widest mt-1">HDFC BANK • TID: 62289923</p>
                            </div>
                            <div className="bg-white mx-auto flex justify-center">
                                <QRCode value={upiUrl} size={220} />
                            </div>
                        </div>
                        
                        <p className="mt-8 text-sm text-muted-foreground bg-muted p-4 rounded-xl">Please complete the payment and click Done to provide your transaction details.</p>
                        <button
                            onClick={() => setCheckoutStep('payment_details')}
                            className="mt-6 w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-sm hover:brightness-110 transition-all"
                        >
                            Done
                        </button>
                        <button
                            onClick={() => setCheckoutStep('review')}
                            className="mt-4 w-full text-muted-foreground hover:text-foreground font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {checkoutStep === 'payment_details' && (
                <div className="max-w-xl mx-auto mt-10">
                    <div className="bg-card border border-border p-8 rounded-2xl shadow-sm animate-in zoom-in-95 fade-in duration-500">
                        <h4 className="text-2xl font-bold text-foreground mb-4">Payment Details</h4>
                        <p className="text-sm text-muted-foreground mb-6">Please provide your account name and transaction ID for verification.</p>
                        
                        <div className="space-y-4 text-left">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account Username</label>
                                <input
                                    type="text"
                                    value={paymentDetails.username}
                                    onChange={e => setPaymentDetails({ ...paymentDetails, username: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-border bg-background p-4 text-base text-foreground outline-none focus:border-primary/50"
                                    placeholder="Name on your account"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Transaction ID / UTR</label>
                                <input
                                    type="text"
                                    value={paymentDetails.transactionId}
                                    onChange={e => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-border bg-background p-4 text-base text-foreground outline-none focus:border-primary/50"
                                    placeholder="e.g. 123456789012"
                                />
                            </div>
                            <button
                                onClick={handlePaymentSubmit}
                                disabled={isSubmittingPayment || !paymentDetails.transactionId}
                                className="mt-6 w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-sm hover:brightness-110 disabled:opacity-50 transition-all"
                            >
                                {isSubmittingPayment ? 'Submitting...' : 'Submit Details'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {checkoutStep === 'success' && (
                <div className="max-w-xl mx-auto mt-10">
                    <div className="bg-card border border-border p-8 rounded-2xl shadow-sm text-center animate-in zoom-in-95 fade-in duration-500">
                        <div className="bg-green-500/10 text-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <h4 className="text-2xl font-bold text-foreground mb-2">Thank You!</h4>
                        <p className="text-base text-muted-foreground mb-8">Your order has been submitted. Our team will verify the payment and activate your custom server shortly.</p>
                        <button
                            onClick={() => {
                                setCheckoutStep('review');
                                setStep(1);
                            }}
                            className="w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-sm hover:brightness-110 transition-all"
                        >
                            Build Another Server
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
