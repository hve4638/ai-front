import fs from 'fs';
import path from 'path';
import Channel from '@hve/channel';
import { formatDateLocal, formatDateUTC } from '@/utils/date';
import { LogEntry, LogLevel, LogOptions } from './types';
import { LevelLogger } from '@/types';

class AfronLogger implements LevelLogger {
    private target: string;
    private verbose: boolean = false;
    private level: LogLevel = LogLevel.INFO;
    private channel: Channel<LogEntry> = new Channel<LogEntry>();
    private closed: boolean = false;

    constructor(logDirectory: string, options: LogOptions = {}) {
        const {
            verbose = false,
            level = LogLevel.INFO
        } = options;
        this.target = '';
        this.verbose = verbose;
        this.level = level;

        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }
        else if (!fs.statSync(logDirectory).isDirectory()) {
            throw new Error(`Log path exists but is not a directory: ${logDirectory}`);
        }

        const dt = formatDateLocal();

        let counter = 0;
        let logFile = path.join(logDirectory, `log-${dt}.txt`);
        while (fs.existsSync(logFile)) {
            counter++;
            logFile = path.join(logDirectory, `log-${dt}-${counter}.txt`);
        }

        this.target = logFile;

        this.workLog();
        this.info(`Log file created: ${formatDateUTC()} (UTC+0)`);
    }

    private async workLog() {
        while (true) {
            const entry = await this.channel.consume();
            if (!entry || entry.done) break;
            if (this.level > entry.level) continue;
            
            try {
                const levelName = this.getLogLevelName(entry.level);
                const text = `[${entry.timestamp}][${levelName}] ${entry.message}`;

                if (this.verbose) {
                    switch (entry.level) {
                        case LogLevel.TRACE:
                        case LogLevel.DEBUG:
                            console.log(text);
                            break;
                        case LogLevel.INFO:
                            console.info(text);
                            break;
                        case LogLevel.WARN:
                            console.warn(text);
                            break;
                        case LogLevel.ERROR:
                        case LogLevel.FATAL:
                            console.error(text);
                            break;
                    }
                }
                fs.appendFileSync(this.target, `${text}\n`);
            } catch (err) {
                console.error('Error writing to log file:', err);
            }
        }
    }

    private getLogLevelName(level: LogLevel): string {
        switch (level) {
            case LogLevel.TRACE: return 'TRACE';
            case LogLevel.DEBUG: return 'DEBUG';
            case LogLevel.INFO: return 'INFO';
            case LogLevel.WARN: return 'WARN';
            case LogLevel.ERROR: return 'ERROR';
            case LogLevel.FATAL: return 'FATAL';
            default: return 'UNKNOWN';
        }
    }

    async trace(...messages: unknown[]) {
        await this.log(LogLevel.TRACE, ...messages);
    }

    async debug(...messages: unknown[]) {
        await this.log(LogLevel.DEBUG, ...messages);
    }

    async info(...messages: unknown[]) {
        await this.log(LogLevel.INFO, ...messages);
    }

    async warn(...messages: unknown[]) {
        await this.log(LogLevel.WARN, ...messages);
    }

    async error(...messages: unknown[]) {
        await this.log(LogLevel.ERROR, ...messages);
    }

    async fatal(...messages: unknown[]) {
        await this.log(LogLevel.FATAL, ...messages);
    }

    async log(level: LogLevel, ...messages: unknown[]) {
        if (this.closed || this.level > level) return;

        const message = messages.map((msg) => {
            if (typeof msg === 'object' && msg != null) {
                try {
                    return JSON.stringify(msg, null, 2);
                }
                catch (e) {
                    return `[Object: ${msg.constructor.name}]`;
                }
            }
            return String(msg);
        }).join(' ');

        const entry: LogEntry = {
            timestamp: formatDateLocal(),
            message,
            level,
            done: false
        };
        await this.channel.produce(entry);
    }

    async close() {
        if (this.closed) return;

        await this.info(`Log closed`);
        this.channel.produceAll({ done: true });
        this.channel.close();
        this.closed = true;
    }
}

export default AfronLogger;