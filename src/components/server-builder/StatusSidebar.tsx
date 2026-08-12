import React from 'react';
import { useServerBuilder } from '../../context/ServerBuilderContext';
import { CheckCircle2, AlertTriangle, CheckCircle } from 'lucide-react';

export const StatusSidebar = () => {
    const { state, isServerComplete, serverComponents } = useServerBuilder();

    // Check if any selected addon requires hosting
    const requiresHosting = state.addons.some(addonId => {
        const addon = serverComponents.find(c => c.id === addonId);
        return addon?.requiredComponents?.includes('Hosting');
    });

    const isHostingComplete = !requiresHosting || state.hosting;

    const StatusItem = ({ label, isComplete }: { label: string, isComplete: boolean }) => (
        <div className="flex items-center space-x-3 mb-4 last:mb-0 transition-colors duration-300">
            {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
                <AlertTriangle className="w-5 h-5 text-destructive/80" />
            )}
            <span className={`text-sm ${isComplete ? 'text-foreground' : 'text-destructive/80 font-medium'}`}>
                {label} {isComplete ? '' : 'Not Selected'}
            </span>
        </div>
    );

    return (
        <div className="sticky top-8">
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-6">Server Status</h3>
            
            <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                <StatusItem label="Streaming Engine" isComplete={!!state.selectedServerId} />
                <StatusItem label="Bandwidth" isComplete={!!state.bandwidthId} />
                <StatusItem label="Player" isComplete={!!state.playerId} />
                <StatusItem label="Storage" isComplete={!!state.storageId} />
                <StatusItem label="Hosting" isComplete={isHostingComplete} />
            </div>

            <div className={`mt-8 p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-500 ${
                isServerComplete 
                    ? 'border-primary/30 bg-primary/10 shadow-sm' 
                    : 'border-destructive/20 bg-destructive/5'
            }`}>
                <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-widest font-bold">Current Status</div>
                {isServerComplete ? (
                    <div className="flex flex-col items-center space-y-2 text-primary font-medium">
                        <CheckCircle className="w-8 h-8 mb-1" />
                        <span className="text-sm tracking-wide">YOUR SERVER IS READY</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-2 text-destructive font-medium">
                        <AlertTriangle className="w-8 h-8 mb-1 opacity-80" />
                        <span className="text-sm tracking-wide text-destructive/90">CONFIGURATION INCOMPLETE</span>
                    </div>
                )}
            </div>
        </div>
    );
};
