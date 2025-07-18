import { EventEmitter } from 'events';

import NoLogger from '@/features/nologger';
import { LevelLogger } from '@/types';

import { RTClosed } from './errors';

export type RTEventListener = (data: RTEventData) => unknown;

const EMITTER_DEFAULT_EVENT = 'default';

class RTEventEmitter {
    protected logger: LevelLogger;

    #id: string;
    #disabled: boolean = false;
    #emitter = new EventEmitter();

    constructor(identifier: string, logger?: LevelLogger) {
        this.#id = identifier;
        this.logger = logger ?? NoLogger.instance;
    }

    get disabled() {
        return this.#disabled;
    }

    on(listener: RTEventListener) {
        this.#emitter.on(EMITTER_DEFAULT_EVENT, listener);

        return () => this.off(listener);
    }

    off(listener: RTEventListener) {
        this.#emitter.off(EMITTER_DEFAULT_EVENT, listener);
    }

    offAll() {
        this.#emitter.removeAllListeners(EMITTER_DEFAULT_EVENT);
    }

    disable() {
        this.#disabled = true;
    }

    #send(eventData: RTEventDataWithoutId) {
        if (this.disabled) throw new RTClosed();

        this.#sendForce(eventData);
    }

    #sendForce(eventData: RTEventDataWithoutId) {
        const fullEventData:RTEventData = {
            id: this.#id,
            ...eventData,
        };
        try {
            this.#emitter.emit(EMITTER_DEFAULT_EVENT, fullEventData);
        }
        catch (e) {
            this.logger.error(`RTEmitter.#sendForce Error occured (${this.#id})`, e);
        }
    }

    readonly emit = {
        update: {
            input: () => {
                this.logger.trace(`[RTEventEmitter] update: input (${this.#id})`);
                this.#send({
                    type: 'update',
                    update_types: ['input'],
                });
            },
            history: () => {
                this.logger.trace(`[RTEventEmitter] update: history (${this.#id})`);
                this.#send({
                    type: 'update',
                    update_types: ['history'],
                });
            }
        },
        output: {
            set: (text: string) => {
                this.logger.trace(`[RTEventEmitter] set_output (${this.#id})`, text);
                this.#send({
                    type: 'set_output',
                    text: text,
                });
            },
            stream: (text: string) => {
                this.logger.trace(`[RTEventEmitter] stream_output (${this.#id})`, text);
                this.#send({
                    type: 'stream_output',
                    text: '',
                });
            },
            clear: () => {
                this.logger.trace(`[RTEventEmitter] clear_output (${this.#id})`);

                this.#send({
                    type: 'clear_output',
                });
            },
        },
        error: {
            noResult: (detail: string[] = []) => {
                this.logger.trace(`[RTEventEmitter] error: no_result (${this.#id})`);

                this.#send({
                    type: 'error',
                    reason_id: 'no_result',
                    detail: detail,
                });
            },
            promptBuildFailed: (detail: string[] = []) => {

            },
            promptEvaluateFailed: (detail: string[] = []) => { },
            fetchFailed: (detail: string[] = []) => { },
            httpError: (http_status:number, detail: string[] = []) => {
                this.logger.trace(`[RTEventEmitter] error: http_error (${this.#id})`);

                this.#send({
                    type: 'error',
                    reason_id: 'http_error',
                    http_status: http_status,
                    detail: detail,
                });
            },
            requestFailed: (detail: string[] = []) => { },
            aborted: (detail: string[] = []) => { },
            invalidModel: (detail: string[] = []) => {
                console.trace(`[RTEventEmitter] error: invalid_model (${this.#id})`);
                this.#sendForce({
                    type: 'error',
                    reason_id: 'invalid_model',
                    detail: detail,
                });
            },
            other: (detail: string[] = []) => {
                console.trace(`RTSender.error.other (${this.#id})`);
                this.#sendForce({
                    type: 'error',
                    reason_id: 'other',
                    detail: detail,
                });
            },
        },
        directive: {
            close: () => {
                console.trace(`RTSender.sendClose (${this.#id})`);
                this.#sendForce({
                    type: 'close',
                });
            },
        }
    } as const;
}

export default RTEventEmitter;