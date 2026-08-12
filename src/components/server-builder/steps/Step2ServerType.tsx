import React from 'react';
import { useServerBuilder } from '../../../context/ServerBuilderContext';

export const Step2ServerType = () => {
    const { state, setSelectedServer, setStep, serverComponents } = useServerBuilder();

    // Show all base components (Servers, Platforms, Automation) for page 2
    const servers = serverComponents.filter(c => 
        c.category === 'Server' || 
        c.category === 'Platform' || 
        c.category === 'Automation'
    );

    const handleSelect = (id: string) => {
        setSelectedServer(id);
        setStep(3); // Auto advance to next step
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Build Your Server</h2>
                <div className="text-xs font-bold text-muted-foreground bg-muted px-4 py-2 rounded-full border border-border">
                    STEP 2 OF 5
                </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-10">What type of streaming do you require?</h1>

            <div className="space-y-4 max-w-3xl">
                {servers.map(server => {
                    const isSelected = state.selectedServerId === server.id;
                    return (
                        <div 
                            key={server.id}
                            onClick={() => handleSelect(server.id)}
                            className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                                ${isSelected 
                                    ? 'bg-primary/5 border-primary shadow-sm' 
                                    : 'bg-card border-border hover:border-primary/50 hover:bg-muted/30'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-4">
                                    <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                        ${isSelected ? 'border-primary text-primary' : 'border-border group-hover:border-primary/50'}
                                    `}>
                                        {isSelected && <div className="w-3 h-3 bg-primary rounded-full" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground mb-2">{server.name}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{server.description}</p>
                                        <div className="text-sm font-medium text-primary">
                                            Component Price: ₹{server.price}/month
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <button className={`px-6 py-2 rounded-full text-sm font-semibold transition-all
                                        ${isSelected ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                                    `}>
                                        {isSelected ? 'SELECTED' : '[ SELECT ]'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-8 flex space-x-4">
                <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    Back
                </button>
            </div>
        </div>
    );
};
