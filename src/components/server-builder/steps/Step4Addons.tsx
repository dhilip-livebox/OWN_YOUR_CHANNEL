import React, { useState } from 'react';
import { useServerBuilder } from '../../../context/ServerBuilderContext';
import { DependencyPopup } from '../DependencyPopup';
import { CheckSquare, Square } from 'lucide-react';

export const Step4Addons = () => {
    const { state, setStep, toggleAddon, checkDependencies, calculateTotal, serverComponents } = useServerBuilder();
    
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
                <h2 className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Build Your Server</h2>
                <div className="text-xs font-bold text-muted-foreground bg-muted px-4 py-2 rounded-full border border-border">
                    STEP 4 OF 5
                </div>
            </div>

            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">MAKE YOUR SERVER MORE POWERFUL</h1>
                <p className="text-muted-foreground">Add only what you require. Combine more facilities for savings.</p>
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
                                    ? 'bg-primary/5 border-primary shadow-sm' 
                                    : 'bg-card border-border hover:border-primary/50 hover:bg-muted/30'
                                }`}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {isSelected ? (
                                    <CheckSquare className="w-6 h-6 text-primary" />
                                ) : (
                                    <Square className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                        {addon.name}
                                    </h3>
                                    <span className="text-primary font-semibold text-sm whitespace-nowrap ml-2">
                                        +₹{addon.price}
                                    </span>
                                </div>
                                {addon.description && (
                                    <p className="text-muted-foreground text-sm leading-snug">{addon.description}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 lg:left-0 lg:right-80 bg-background/90 backdrop-blur-xl border-t border-border p-4 shadow-lg z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center space-x-6">
                        <button 
                            onClick={() => setStep(3)}
                            className="text-muted-foreground hover:text-foreground font-semibold transition-colors"
                        >
                            Back
                        </button>
                        <div>
                            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Total Config</div>
                            <div className="text-xl font-bold text-primary">₹{calculateTotal()}/mo</div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setStep(5)}
                        className="bg-primary hover:brightness-110 text-primary-foreground font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center"
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
