import { LevelLogger } from '@/types';

class NoLogger implements LevelLogger {
    static instance: NoLogger = new NoLogger();

    private constructor() {}

    async trace(...messages: unknown[]) {}
    async debug(...messages: unknown[]) {}
    async info(...messages: unknown[]) {}
    async warn(...messages: unknown[]) {}
    async error(...messages: unknown[]) {}
    async fatal(...messages: unknown[]) {}
    async close() {}
}

export default NoLogger;