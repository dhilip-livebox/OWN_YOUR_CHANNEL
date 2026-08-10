import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface DependencyPopupProps {
    addonName: string;
    missingRequirements: { type: string, message: string, autoFix: () => void }[];
    onConfirm: () => void;
    onCancel: () => void;
}

export const DependencyPopup = ({ addonName, missingRequirements, onConfirm, onCancel }: DependencyPopupProps) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100">{addonName} Requirements</h3>
                    </div>
                    
                    <p className="text-slate-400 mb-6 text-sm">
                        To operate your {addonName}, you also need the following components. They will be automatically included in your server configuration.
                    </p>

                    <div className="space-y-3 mb-8">
                        {missingRequirements.map((req, i) => (
                            <div key={i} className="flex items-center space-x-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span className="text-slate-300 text-sm font-medium">{req.message}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex space-x-3">
                        <button 
                            onClick={onConfirm}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
                        >
                            Add Requirements
                        </button>
                        <button 
                            onClick={onCancel}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
