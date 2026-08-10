import React from 'react';
import { useServerBuilder } from '../../../context/ServerBuilderContext';
import { serverComponents } from '../../../data/serverComponents';

export const Step2ServerType = () => {
    const { state, setSelectedServer, setStep } = useServerBuilder();

    // Show only the specific servers requested for page 2
    const servers = serverComponents.filter(c => ['S01', 'S02', 'S03', 'S04'].includes(c.id));

    const handleSelect = (id: string) => {
        setSelectedServer(id);
        setStep(3); // Auto advance to next step
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm text-slate-500 font-bold uppercase tracking-widest">Build Your Server</h2>
                <div className="text-xs font-bold text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                    STEP 2 OF 5
                </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-100 mb-10">What type of streaming do you require?</h1>

            <div className="space-y-4 max-w-3xl">
                {servers.map(server => {
                    const isSelected = state.selectedServerId === server.id;
                    return (
                        <div 
                            key={server.id}
                            onClick={() => handleSelect(server.id)}
                            className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                                ${isSelected 
                                    ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-4">
                                    <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                        ${isSelected ? 'border-blue-500 text-blue-500' : 'border-slate-600 group-hover:border-slate-400'}
                                    `}>
                                        {isSelected && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-200 mb-2">{server.name}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4">{server.description}</p>
                                        <div className="text-sm font-medium text-emerald-400">
                                            Component Price: ₹{server.price}/month
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <button className={`px-6 py-2 rounded-full text-sm font-semibold transition-all
                                        ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}
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
                    className="px-6 py-3 rounded-xl font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                    Back
                </button>
            </div>
        </div>
    );
};
