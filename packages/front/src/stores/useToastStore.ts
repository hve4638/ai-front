import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export type Toast = {
    title: string;
    description: string|null;
    type: ToastMessageType;
}

type ToastMessageType = 'error' | 'info' | 'success' | 'warn';

interface ToastState {
    add: (title:string, description:string|null, type: ToastMessageType) => void;
    toast : Toast | null;
}

const useToastStore = create<ToastState, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set,) => ({
        add: (title:string, description:string|null, type: ToastMessageType) => {
            set(state => ({
                toast: {
                    title,
                    description,
                    type,
                },
            }));
        },
        toast : null,
    }))
);

export default useToastStore;