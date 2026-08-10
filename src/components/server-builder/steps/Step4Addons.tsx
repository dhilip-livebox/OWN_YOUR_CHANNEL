import React, { useState } from 'react';
import { useServerBuilder } from '../../../context/ServerBuilderContext';
import { serverComponents } from '../../../data/serverComponents';
import { DependencyPopup } from '../DependencyPopup';
import { CheckSquare, Square } from 'lucide-react';

export const Step4Addons = () => {
    const { state, setStep, toggleAddon, checkDependencies, calculateTotal } = useServerBuilder();
    
    const [pendingAddon, setPendingAddon] = useState<string | null>(null);
    const [missingReqs, setMissingReqs] = useState<any[]>([]);

    const addons = serverComponents.filter(c => 
        ['S04', 'S05', 'S06', 'S07', 'S08', 'A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07'].includes(c.id)
    );

    const handleToggle = (id: string) => {
        // If we are turning it off, just toggle
        if (state.addons.includes(id)) {
            toggleAddon(id);
            return;
        }

        // If turning it on, check dependencies
        const missing = checkDependencies(id);
        if (missing.length > 0) {
            setPendingAddon(id);
            setMissingReqs(missing);
        } else {
            toggleAddon(id);
        }
    };

    const handleConfirmDependencies = () => {
        missingReqs.forEach(req => req.autoFix());
        if (pendingAddon) {
            toggleAddon(pendingAddon);
        }
        setPendingAddon(null);
        setMissingReqs([]);
    };

    const handleCancelDependencies = () => {
        setPendingAddon(null);
        setMissingReqs([]);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 pb-20">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm text-slate-500 font-bold uppercase tracking-widest">Build Your Server</h2>
                <div className="text-xs font-bold text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                    STEP 4 OF 5
                </div>
            </div>

            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">MAKE YOUR SERVER MORE POWERFUL</h1>
                <p className="text-slate-400">Add only what you require. Combine more facilities for savings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {addons.map(addon => {
                    const isSelected = state.addons.includes(addon.id);
                    return (
                        <div 
                            key={addon.id}
                            onClick={() => handleToggle(addon.id)}
                            className={`group p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start space-x-4
                                ${isSelected 
                                    ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60'
                                }`}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {isSelected ? (
                                    <CheckSquare className="w-6 h-6 text-blue-500" />
                                ) : (
                                    <Square className="w-6 h-6 text-slate-500 group-hover:text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold ${isSelected ? 'text-blue-100' : 'text-slate-200'}`}>
                                        {addon.name}
                                    </h3>
                                    <span className="text-emerald-400 font-semibold text-sm whitespace-nowrap ml-2">
                                        +₹{addon.price}
                                    </span>
                                </div>
                                {addon.description && (
                                    <p className="text-slate-400 text-sm leading-snug">{addon.description}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 lg:left-0 lg:right-80 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center space-x-6">
                        <button 
                            onClick={() => setStep(3)}
                            className="text-slate-400 hover:text-slate-200 font-semibold transition-colors"
                        >
                            Back
                        </button>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Config</div>
                            <div className="text-xl font-bold text-emerald-400">₹{calculateTotal()}/mo</div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setStep(5)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center"
                    >
                        REVIEW & FINALIZE
                    </button>
                </div>
            </div>

            {pendingAddon && (
                <DependencyPopup
                    addonName={addons.find(a => a.id === pendingAddon)?.name || 'Add-on'}
                    missingRequirements={missingReqs}
                    onConfirm={handleConfirmDependencies}
                    onCancel={handleCancelDependencies}
                />
            )}
        </div>
    );
};
