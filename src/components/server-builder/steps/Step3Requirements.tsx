import React from 'react';
import { useServerBuilder } from '../../../context/ServerBuilderContext';
import { CheckCircle2 } from 'lucide-react';

export const Step3Requirements = () => {
    const { state, setRequirement, setStep, calculateTotal, serverComponents, requirementOptions } = useServerBuilder();

    if (!requirementOptions) {
        return <div className="text-slate-400 p-8 text-center animate-pulse">Loading configuration...</div>;
    }

    const selectedServer = serverComponents.find(c => c.id === state.selectedServerId);

    // Filter requirements to show based on what this server supports/requires
    // For simplicity based on prompt, we show Bandwidth, Player, and Storage choices.
    
    const handleNext = () => {
        // Can add validation here if needed
        setStep(4);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Build Your Server</h2>
                <div className="text-xs font-bold text-muted-foreground bg-muted px-4 py-2 rounded-full border border-border">
                    STEP 3 OF 5
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 mb-10 text-center shadow-sm">
                <div className="text-muted-foreground text-sm font-semibold uppercase tracking-widest mb-2">YOUR BASE CONFIGURATION</div>
                <div className="flex items-center justify-center space-x-3 text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xl font-bold">{selectedServer?.name || 'Streaming Server'}</span>
                </div>
                <div className="text-foreground mt-2 font-medium">₹{selectedServer?.price || 499}/month</div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-8">TO MAKE THIS SERVER READY TO USE:</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-10">
                    {/* Bandwidth Section */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Bandwidth Required</h3>
                        <div className="space-y-2">
                            {requirementOptions.bandwidth.map(bw => (
                                <label key={bw.id} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${state.bandwidthId === bw.id ? 'bg-primary/5 border-primary' : 'bg-card border-border hover:bg-muted/30'}`}>
                                    <input 
                                        type="radio" 
                                        name="bandwidth" 
                                        className="w-5 h-5 text-primary bg-background border-border focus:ring-primary"
                                        checked={state.bandwidthId === bw.id}
                                        onChange={() => setRequirement('bandwidth', bw.id)}
                                    />
                                    <span className="ml-4 text-foreground font-medium flex-1">{bw.name}</span>
                                    {bw.price > 0 && <span className="text-muted-foreground text-sm">+₹{bw.price}</span>}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Storage Section */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Storage Required?</h3>
                        <div className="space-y-2">
                            {requirementOptions.storage.map(st => (
                                <label key={st.id} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${state.storageId === st.id ? 'bg-primary/5 border-primary' : 'bg-card border-border hover:bg-muted/30'}`}>
                                    <input 
                                        type="radio" 
                                        name="storage" 
                                        className="w-5 h-5 text-primary bg-background border-border focus:ring-primary"
                                        checked={state.storageId === st.id}
                                        onChange={() => setRequirement('storage', st.id)}
                                    />
                                    <span className="ml-4 text-foreground font-medium flex-1">{st.name}</span>
                                    {st.price > 0 && <span className="text-muted-foreground text-sm">+₹{st.price}</span>}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Player Section */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">How will your viewers watch?</h3>
                        <div className="space-y-2">
                            {requirementOptions.player.map(pl => (
                                <label key={pl.id} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${state.playerId === pl.id ? 'bg-primary/5 border-primary' : 'bg-card border-border hover:bg-muted/30'}`}>
                                    <input 
                                        type="radio" 
                                        name="player" 
                                        className="w-5 h-5 text-primary bg-background border-border focus:ring-primary"
                                        checked={state.playerId === pl.id}
                                        onChange={() => setRequirement('player', pl.id)}
                                    />
                                    <span className="ml-4 text-foreground font-medium flex-1">{pl.name}</span>
                                    {pl.price > 0 && <span className="text-muted-foreground text-sm">+₹{pl.price}</span>}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Running Total */}
                <div>
                    <div className="sticky top-8 bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-md">
                        <h3 className="text-xl font-bold text-center text-foreground mb-6">YOUR SERVER</h3>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-foreground">
                                <span>{selectedServer?.name?.replace(' Server', '') || 'Server'}</span>
                                <span className="font-medium">₹{selectedServer?.price || 499}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Bandwidth</span>
                                <span>{state.bandwidthId ? `₹${requirementOptions.bandwidth.find(b => b.id === state.bandwidthId)?.price}` : '₹____'}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Player</span>
                                <span>{state.playerId ? `₹${requirementOptions.player.find(p => p.id === state.playerId)?.price}` : '₹____'}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Storage</span>
                                <span>{state.storageId ? `₹${requirementOptions.storage.find(s => s.id === state.storageId)?.price}` : '₹____'}</span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-6 flex justify-between items-center mb-8">
                            <span className="text-lg text-foreground font-bold">Current Total</span>
                            <span className="text-3xl text-primary font-extrabold">₹{calculateTotal()}</span>
                        </div>

                        <button 
                            onClick={handleNext}
                            className="w-full bg-primary hover:brightness-110 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                            CONTINUE TO UPGRADES
                        </button>
                        
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full mt-4 text-muted-foreground hover:text-foreground font-semibold py-2 transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
