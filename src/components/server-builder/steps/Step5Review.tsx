import React from 'react';
import { useServerBuilder } from '../../../context/ServerBuilderContext';
import { serverComponents, requirementOptions } from '../../../data/serverComponents';
import { Check, MessageCircle, FileText, PhoneCall, ShoppingCart } from 'lucide-react';

export const Step5Review = () => {
    const { state, calculateTotal, setStep } = useServerBuilder();

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

    const renderLineItem = (label: string, price: number | string) => (
        <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
            <div className="flex items-center space-x-3 text-slate-300">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{label}</span>
            </div>
            <span className="font-medium text-slate-400">
                {typeof price === 'number' ? `₹${price}` : price}
            </span>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto pb-20">
            <div className="text-center mb-12">
                <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 mb-6">
                    <div className="bg-slate-950 px-8 py-4 rounded-xl flex items-center justify-center space-x-3">
                        <Check className="w-8 h-8 text-emerald-400" />
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 uppercase tracking-wider">
                            YOUR CUSTOM STREAMING SERVER IS READY
                        </h1>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 md:p-10">
                    <h2 className="text-lg font-bold text-slate-200 mb-6 uppercase tracking-widest border-b border-slate-700 pb-4">Your Configuration</h2>
                    
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

                    <div className="space-y-4 pt-6 border-t border-slate-700">
                        <div className="flex justify-between items-center text-slate-400">
                            <span className="text-lg">Standard Price</span>
                            <span className="text-xl line-through">₹{baseTotal}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-emerald-400 font-medium bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                            <span className="flex items-center"><Check className="w-5 h-5 mr-2" /> CUSTOM SERVER BUNDLE DISCOUNT</span>
                            <span>-₹{discount}</span>
                        </div>
                        
                        <div className="flex justify-between items-end pt-4">
                            <div>
                                <span className="block text-sm text-slate-500 font-bold uppercase tracking-widest mb-1">YOUR SPECIAL PRICE</span>
                                <span className="block text-emerald-500 font-medium">You Save ₹{discount} Every Month</span>
                            </div>
                            <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                ₹{finalPrice} <span className="text-xl text-slate-500 font-bold">/ MO</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 p-6 md:p-10 border-t border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                            <ShoppingCart className="w-5 h-5" />
                            <span>BUY / SUBSCRIBE NOW</span>
                        </button>
                        
                        <button className="flex items-center justify-center space-x-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/50 font-bold py-4 px-6 rounded-xl transition-all">
                            <MessageCircle className="w-5 h-5" />
                            <span>WHATSAPP THIS CONFIG</span>
                        </button>
                        
                        <button className="flex items-center justify-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/50 font-bold py-4 px-6 rounded-xl transition-all">
                            <FileText className="w-5 h-5" />
                            <span>SEND ME A QUOTATION</span>
                        </button>
                        
                        <button className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-6 rounded-xl transition-all">
                            <PhoneCall className="w-5 h-5" />
                            <span>TALK TO SPECIALIST</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button 
                    onClick={() => setStep(4)}
                    className="text-slate-500 hover:text-slate-300 font-semibold transition-colors"
                >
                    Back to Add-ons
                </button>
            </div>
        </div>
    );
};
