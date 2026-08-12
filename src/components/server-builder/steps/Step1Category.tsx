import React from 'react';
import { useServerBuilder } from '../../../context/ServerBuilderContext';
import { Tv, Server, Radio, PlaySquare, ArrowRight, Settings } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

export const Step1Category = () => {
    const { state, setMainCategory, setStep } = useServerBuilder();
    const navigate = useNavigate();

    const categories = [
        { id: 'livetv', name: 'DIGITAL LIVE TV CHANNEL', icon: <Tv className="w-8 h-8 text-white drop-shadow-md" />, gradient: "from-cyan-400 to-blue-600", color: "from-cyan-500/20 to-cyan-500/5" },
        { id: 'server', name: 'LIVE STREAMING SERVER', icon: <Server className="w-8 h-8 text-white drop-shadow-md" />, gradient: "from-violet-400 to-purple-600", color: "from-violet-500/20 to-violet-500/5" },
        { id: 'ott', name: 'OTT / IPTV PLATFORM', icon: <PlaySquare className="w-8 h-8 text-white drop-shadow-md" />, gradient: "from-amber-400 to-orange-500", color: "from-amber-500/20 to-amber-500/5" },
        { id: 'radio', name: 'RADIO STATION', icon: <Radio className="w-8 h-8 text-white drop-shadow-md" />, gradient: "from-lime-400 to-green-600", color: "from-lime-500/20 to-lime-500/5" },
        { id: 'broadcast', name: 'LOCAL TV / MSO BROADCASTING', icon: <Tv className="w-8 h-8 text-white drop-shadow-md" />, gradient: "from-rose-400 to-red-500", color: "from-rose-500/20 to-rose-500/5" },
        { id: 'manual', name: 'BUILD MANUALLY (I KNOW WHAT I NEED)', icon: <Settings className="w-8 h-8 text-white drop-shadow-md" />, gradient: "from-sky-400 to-blue-600", color: "from-sky-500/20 to-sky-500/5" }
    ];

    const handleSelect = (id: string) => {
        if (id === 'manual') {
            navigate({ to: '/purchase' });
            return;
        }
        setMainCategory(id);
        setStep(2);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                    BUILD YOUR OWN STREAMING SERVER
                </h1>
                <p className="text-lg text-muted-foreground">Pick Only What Your Business Needs</p>
                <div className="mt-6 inline-block bg-primary/10 border border-primary/20 rounded-full px-6 py-2 text-sm font-medium text-primary shadow-sm">
                    Starting from ₹499 per Component • More Facilities You Combine = More Savings
                </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-8 text-foreground">What would you like to build?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleSelect(cat.id)}
                        className={`group relative p-8 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center overflow-hidden bg-gradient-to-br ${cat.color} backdrop-blur-sm hover:shadow-xl
                            ${state.mainCategory === cat.id 
                                ? 'border-primary shadow-md ring-1 ring-primary' 
                                : 'border-border/50 hover:border-border'
                            }`}
                    >
                        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-lg shadow-black/20 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110
                            ${state.mainCategory === cat.id ? 'ring-primary ring-2' : ''}
                        `}>
                            {cat.icon}
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-4">{cat.name}</h3>
                        <div className={`mt-auto px-6 py-2 rounded-full text-sm font-semibold transition-all
                            ${state.mainCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                        `}>
                            [ SELECT ]
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="mt-16 text-center space-y-4">
                <p className="text-muted-foreground font-medium">Not sure what you need?</p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <a href="/#contact-us" className="text-primary hover:text-primary/80 font-semibold transition-colors flex items-center">
                        TALK TO OUR SERVER SPECIALIST <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                </div>
            </div>
        </div>
    );
};
