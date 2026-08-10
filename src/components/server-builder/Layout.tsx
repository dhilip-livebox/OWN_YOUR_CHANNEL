import React from 'react';
import { StatusSidebar } from './StatusSidebar';

export const ServerBuilderLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen bg-[#020617] text-slate-100 font-sans">
            <div className="flex-1 p-6 sm:p-10 lg:p-16 overflow-y-auto w-full max-w-5xl mx-auto">
                {children}
            </div>
            <div className="w-80 bg-slate-900/40 backdrop-blur-xl border-l border-slate-800/60 p-6 hidden lg:block shadow-2xl">
                <StatusSidebar />
            </div>
        </div>
    );
};
