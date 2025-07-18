import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type BootStates = {
    booted: boolean;
    phase: number;
    update: {
        booted: (booted: boolean) => void;
        phase: (phase: number) => void;
        nextPhase: () => void;
    }
}

export const useBootStore = create<BootStates, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set) => ({
        booted: false,
        phase: 0,

        update: {
            booted: (booted: boolean) => set({ booted }),
            phase: (phase: number) => set({ phase }),
            nextPhase: () => set((state) => ({ phase: state.phase + 1 }))
        },
    }))
);

export default useBootStore;