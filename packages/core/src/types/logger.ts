type LogMethod = (...message: unknown[]) => Promise<void>;

export interface LevelLogger {
    error: LogMethod;
    warn: LogMethod;
    info: LogMethod;
    debug: LogMethod;
    trace: LogMethod;
}