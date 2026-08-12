import React from 'react';
import { StatusSidebar } from './StatusSidebar';

export const ServerBuilderLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex bg-background text-foreground font-sans">
            <div className="flex-1 p-6 sm:p-10 lg:p-16 overflow-y-auto w-full max-w-5xl mx-auto">
                {children}
            </div>
            <div className="w-80 bg-card/40 backdrop-blur-xl border-l border-border p-6 hidden lg:block shadow-2xl">
                <StatusSidebar />
            </div>
        </div>
    );
};
