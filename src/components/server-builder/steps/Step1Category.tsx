import React from 'react';
import { useServerBuilder } from '../../../context/ServerBuilderContext';
import { Tv, Server, Radio, PlaySquare, ArrowRight, Settings } from 'lucide-react';

export const Step1Category = () => {
    const { state, setMainCategory, setStep } = useServerBuilder();

    const categories = [
        { id: 'livetv', name: 'DIGITAL LIVE TV CHANNEL', icon: <Tv className="w-8 h-8" /> },
        { id: 'server', name: 'LIVE STREAMING SERVER', icon: <Server className="w-8 h-8" /> },
        { id: 'ott', name: 'OTT / IPTV PLATFORM', icon: <PlaySquare className="w-8 h-8" /> },
        { id: 'radio', name: 'RADIO STATION', icon: <Radio className="w-8 h-8" /> },
        { id: 'broadcast', name: 'LOCAL TV / MSO BROADCASTING', icon: <Tv className="w-8 h-8" /> },
        { id: 'manual', name: 'BUILD MANUALLY (I KNOW WHAT I NEED)', icon: <Settings className="w-8 h-8" /> }
    ];

    const handleSelect = (id: string) => {
        setMainCategory(id);
        setStep(2);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 mb-4 tracking-tight">
                    BUILD YOUR OWN STREAMING SERVER
                </h1>
                <p className="text-lg text-slate-400">Pick Only What Your Business Needs</p>
                <div className="mt-6 inline-block bg-slate-900/50 border border-slate-700/50 rounded-full px-6 py-2 text-sm font-medium text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                    Starting from ₹499 per Component • More Facilities You Combine = More Savings
                </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-8 text-slate-200">What would you like to build?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleSelect(cat.id)}
                        className={`group relative p-8 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center overflow-hidden
                            ${state.mainCategory === cat.id 
                                ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                                : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                            }`}
                    >
                        <div className={`mb-4 p-4 rounded-full transition-colors duration-300
                            ${state.mainCategory === cat.id ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400 group-hover:text-slate-300 group-hover:bg-slate-700'}
                        `}>
                            {cat.icon}
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 mb-4">{cat.name}</h3>
                        <div className={`mt-auto px-6 py-2 rounded-full text-sm font-semibold transition-all
                            ${state.mainCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}
                        `}>
                            [ SELECT ]
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="mt-16 text-center space-y-4">
                <p className="text-slate-500 font-medium">Not sure what you need?</p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center">
                        TALK TO OUR SERVER SPECIALIST <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <span className="text-slate-700 hidden sm:block">OR</span>
                    <button className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center">
                        VIEW READY-MADE SERVER PLANS <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};
