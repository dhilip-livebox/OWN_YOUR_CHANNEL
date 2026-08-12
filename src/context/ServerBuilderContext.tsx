import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServerComponents, getRequirementOptions, getCachedServerComponentsSync, getCachedRequirementOptionsSync, ComponentItem, RequirementsConfig } from '../lib/admin.functions';

interface ServerBuilderState {
  currentStep: number;
  mainCategory: string | null;
  selectedServerId: string | null;
  bandwidthId: string | null;
  playerId: string | null;
  storageId: string | null;
  hosting: boolean;
  addons: string[];
}

interface MissingRequirement {
    type: string;
    message: string;
    autoFix: () => void;
}

interface ServerBuilderContextType {
  state: ServerBuilderState;
  setStep: (step: number) => void;
  setMainCategory: (category: string) => void;
  setSelectedServer: (serverId: string | null) => void;
  setRequirement: (type: 'bandwidth' | 'player' | 'storage', id: string | null) => void;
  setHosting: (val: boolean) => void;
  toggleAddon: (addonId: string) => void;
  calculateTotal: () => number;
  checkDependencies: (addonId: string) => MissingRequirement[];
  isServerComplete: boolean;
  serverComponents: ComponentItem[];
  requirementOptions: RequirementsConfig | null;
}

const defaultState: ServerBuilderState = {
  currentStep: 1,
  mainCategory: null,
  selectedServerId: null,
  bandwidthId: null,
  playerId: null,
  storageId: null,
  hosting: false,
  addons: [],
};

const ServerBuilderContext = createContext<ServerBuilderContextType | undefined>(undefined);

export const ServerBuilderProvider = ({ children, initialCategory }: { children: ReactNode, initialCategory?: string }) => {
  const [state, setState] = useState<ServerBuilderState>({
    ...defaultState,
    mainCategory: initialCategory || null,
    currentStep: initialCategory ? 2 : 1
  });

  const { data: serverComponents = [] } = useQuery({
    queryKey: ['serverComponents'],
    queryFn: getServerComponents,
    placeholderData: getCachedServerComponentsSync,
    staleTime: 60_000,
  });

  const { data: requirementOptions = null } = useQuery({
    queryKey: ['requirementOptions'],
    queryFn: getRequirementOptions,
    placeholderData: getCachedRequirementOptionsSync,
    staleTime: 60_000,
  });

  const setStep = (step: number) => setState(s => ({ ...s, currentStep: step }));
  const setMainCategory = (category: string) => setState(s => ({ ...s, mainCategory: category }));
  const setSelectedServer = (serverId: string | null) => setState(s => ({ ...s, selectedServerId: serverId }));
  const setRequirement = (type: 'bandwidth' | 'player' | 'storage', id: string | null) => {
    setState(s => ({
        ...s,
        bandwidthId: type === 'bandwidth' ? id : s.bandwidthId,
        playerId: type === 'player' ? id : s.playerId,
        storageId: type === 'storage' ? id : s.storageId,
    }));
  };
  const setHosting = (val: boolean) => setState(s => ({ ...s, hosting: val }));

  const toggleAddon = (addonId: string) => {
    setState(s => {
      const addons = s.addons.includes(addonId)
        ? s.addons.filter(id => id !== addonId)
        : [...s.addons, addonId];
      return { ...s, addons };
    });
  };

  const calculateTotal = () => {
    let total = 0;
    if (state.selectedServerId) {
        const server = serverComponents.find(c => c.id === state.selectedServerId);
        if (server) total += server.price;
    }
    
    if (state.bandwidthId && requirementOptions?.bandwidth) {
        const bw = requirementOptions.bandwidth.find(b => b.id === state.bandwidthId);
        if (bw) total += bw.price;
    }
    if (state.playerId && requirementOptions?.player) {
        const pl = requirementOptions.player.find(p => p.id === state.playerId);
        if (pl) total += pl.price;
    }
    if (state.storageId && requirementOptions?.storage) {
        const st = requirementOptions.storage.find(s => s.id === state.storageId);
        if (st) total += st.price;
    }
    
    state.addons.forEach(addonId => {
        const addon = serverComponents.find(c => c.id === addonId);
        if (addon) total += addon.price;
    });
    
    return total;
  };

  const checkDependencies = (addonId: string): MissingRequirement[] => {
    const addon = serverComponents.find(c => c.id === addonId);
    if (!addon) return [];

    const missing: MissingRequirement[] = [];

    // Rule: Need RTMP (S01)
    if (addon.requiredComponents?.includes('S01') && state.selectedServerId !== 'S01') {
        missing.push({
            type: 'Server',
            message: 'RTMP Streaming Server is required',
            autoFix: () => setSelectedServer('S01')
        });
    }

    // Rule: Need Hosting
    if (addon.requiredComponents?.includes('Hosting') && !state.hosting) {
        missing.push({
            type: 'Hosting',
            message: 'Hosting Server is required',
            autoFix: () => setHosting(true)
        });
    }

    // Check minimum capacities
    addon.minimumCapacity?.forEach((cap: any) => {
        if (cap.type === 'Storage' && requirementOptions?.storage) {
            const currentStorage = state.storageId ? requirementOptions.storage.find(s => s.id === state.storageId)?.value || 0 : 0;
            if (currentStorage < cap.value) {
                // Find storage that matches or exceeds
                const sufficient = requirementOptions.storage.find(s => (s.value || 0) >= cap.value);
                if (sufficient) {
                    missing.push({
                        type: 'Storage',
                        message: `Minimum ${cap.value} GB Storage required`,
                        autoFix: () => setRequirement('storage', sufficient.id)
                    });
                }
            }
        }
        if (cap.type === 'Bandwidth' && requirementOptions?.bandwidth) {
            const currentBw = state.bandwidthId ? requirementOptions.bandwidth.find(b => b.id === state.bandwidthId)?.value || 0 : 0;
            if (currentBw < cap.value) {
                const sufficient = requirementOptions.bandwidth.find(b => (b.value || 0) >= cap.value);
                if (sufficient) {
                    missing.push({
                        type: 'Bandwidth',
                        message: `Minimum ${cap.value} GB Bandwidth required`,
                        autoFix: () => setRequirement('bandwidth', sufficient.id)
                    });
                }
            }
        }
    });

    return missing;
  };

  const isServerComplete = !!state.selectedServerId && !!state.bandwidthId && !!state.playerId && !!state.storageId;

  return (
    <ServerBuilderContext.Provider value={{
      state,
      setStep,
      setMainCategory,
      setSelectedServer,
      setRequirement,
      setHosting,
      toggleAddon,
      calculateTotal,
      checkDependencies,
      isServerComplete,
      serverComponents,
      requirementOptions
    }}>
      {children}
    </ServerBuilderContext.Provider>
  );
};

export const useServerBuilder = () => {
  const context = useContext(ServerBuilderContext);
  if (context === undefined) {
    throw new Error('useServerBuilder must be used within a ServerBuilderProvider');
  }
  return context;
};
