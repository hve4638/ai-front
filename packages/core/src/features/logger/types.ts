export type LogEntry = {
    timestamp: string;
    message: string;
    level: LogLevel;
    done: false;
} | {
    done: true;
}

export const LogLevel = {
    TRACE : 0,
    DEBUG : 1,
    INFO : 2,
    WARN : 3,
    ERROR : 4,
    FATAL : 5,
} as const;
export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

export type LogOptions = {
    verbose?: boolean;
    level?: LogLevel;
}