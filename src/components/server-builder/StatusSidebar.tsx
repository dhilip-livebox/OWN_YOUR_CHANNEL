import React from 'react';
import { useServerBuilder } from '../../context/ServerBuilderContext';
import { CheckCircle2, AlertTriangle, CheckCircle } from 'lucide-react';
import { serverComponents } from '../../data/serverComponents';

export const StatusSidebar = () => {
    const { state, isServerComplete } = useServerBuilder();

    // Check if any selected addon requires hosting
    const requiresHosting = state.addons.some(addonId => {
        const addon = serverComponents.find(c => c.id === addonId);
        return addon?.requiredComponents?.includes('Hosting');
    });

    const isHostingComplete = !requiresHosting || state.hosting;

    const StatusItem = ({ label, isComplete }: { label: string, isComplete: boolean }) => (
        <div className="flex items-center space-x-3 mb-4 last:mb-0 transition-colors duration-300">
            {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500/80" />
            )}
            <span className={`text-sm ${isComplete ? 'text-slate-300' : 'text-amber-500/80 font-medium'}`}>
                {label} {isComplete ? '' : 'Not Selected'}
            </span>
        </div>
    );

    return (
        <div className="sticky top-8">
            <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-6">Server Status</h3>
            
            <div className="bg-[#020617]/50 p-5 rounded-2xl border border-slate-800/50 shadow-inner">
                <StatusItem label="Streaming Engine" isComplete={!!state.selectedServerId} />
                <StatusItem label="Bandwidth" isComplete={!!state.bandwidthId} />
                <StatusItem label="Player" isComplete={!!state.playerId} />
                <StatusItem label="Storage" isComplete={!!state.storageId} />
                <StatusItem label="Hosting" isComplete={isHostingComplete} />
            </div>

            <div className={`mt-8 p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-500 ${
                isServerComplete 
                    ? 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                    : 'border-amber-500/20 bg-amber-500/5'
            }`}>
                <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest font-bold">Current Status</div>
                {isServerComplete ? (
                    <div className="flex flex-col items-center space-y-2 text-emerald-400 font-medium">
                        <CheckCircle className="w-8 h-8 mb-1" />
                        <span className="text-sm tracking-wide">YOUR SERVER IS READY</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-2 text-amber-500 font-medium">
                        <AlertTriangle className="w-8 h-8 mb-1 opacity-80" />
                        <span className="text-sm tracking-wide text-amber-400/90">CONFIGURATION INCOMPLETE</span>
                    </div>
                )}
            </div>
        </div>
    );
};
