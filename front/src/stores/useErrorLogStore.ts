import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface LogEntry {
    message: string;
    detail: string[];
    occurredAt: {
        type: 'global';
    } | {
        type: 'session';
        sessionId: string;
    } | {
        type: 'unknown';
    };
}

const MAX_LOG_ENTRIES = 250;

interface ErrorLogState {
    hasUnread : boolean;
    markAsRead: () => void;

    last: LogEntry | undefined;
    log: LogEntry[];
    add: (entry: LogEntry) => void;
}

const useErrorLogStore = create<ErrorLogState, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set, get) => ({
        hasUnread: false,
        markAsRead: () => set(state=>({ hasUnread: false })),

        last: undefined,
        log: [],
        add: (entry: LogEntry) => {
            set(state => ({
                log: [...state.log.slice(-MAX_LOG_ENTRIES + 1), entry],
                hasUnread: true,
                last: entry,
            }));
        },
    }))
);

export default useErrorLogStore;