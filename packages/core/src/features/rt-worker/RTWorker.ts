import type { Profile } from '@/features/profiles';
import type { LevelLogger } from '@/types';

import { WorkflowPromptOnly } from './workflow';
import RTEventEmitter, { RTEventListener } from './RTEventEmitter';
import NoLogger from '../nologger';

type WorkRequired = {
    profile: Profile;
    sessionId: string;
}

class RTWorker {
    protected logger: LevelLogger;

    #tokens: Set<string> = new Set();
    #handlers: RTEventListener[];

    constructor(handlers: RTEventListener[], logger?: LevelLogger) {
        this.#handlers = [...handlers];
        this.logger = logger ?? NoLogger.instance;
    }

    async addRTEventListener(handler: RTEventListener): Promise<void> {
        this.#handlers.push(handler);
    }

    async request(token: string, { profile, sessionId }: WorkRequired): Promise<string> {
        if (this.#tokens.has(token)) {
            this.logger.error(`RTWork failed: duplicate token`, token);

            throw new Error(`Duplicate token: ${token}`);
        }
        const configAC = await profile.accessAsJSON('config.json');
        const { clear_on_submit_normal, clear_on_submit_chat } = configAC.get('clear_on_submit_normal', 'clear_on_submit_chat');

        const session = profile.session(sessionId);
        const { rt_id, model_id } = await session.get('config.json', ['rt_id', 'model_id']);
        const { input, upload_files } = await session.get('cache.json', ['input', 'upload_files']);
        const form = await session.getOne('data.json', `forms.${rt_id}`);
        const { input_type } = await profile.rt(rt_id).getMetadata();

        const rtInput: RTInput = {
            rtId: rt_id,
            modelId: model_id,
            sessionId: sessionId,
            form: form ?? {},
            input: input ?? '',
            inputFiles: upload_files ?? [],
            chat: [],
        }

        this.logger.trace(`RT request started (${token})`)
        const emitter = new RTEventEmitter(token, this.logger);
        emitter.on(this.#handlers[0]);
        const process = new WorkflowPromptOnly(emitter, profile);

        if (
            (input_type === 'normal' && clear_on_submit_normal)
            || (input_type === 'chat' && clear_on_submit_chat)
        ) {
            session.set('cache.json', { input: '', upload_files: [] });
            emitter.emit.update.input();
        }

        this.#tokens.add(token);
        process.process(rtInput)
            .then(() => {
                this.logger.info(`RT request completed (${token})`);
            })
            .catch((error) => {
                this.logger.info(`RT request failed (${token})`);
                this.logger.error(`RT request error:`, error);
            })
            .finally(() => {
                emitter.emit.directive.close();

                this.#tokens.delete(token);
            });

        return token;
    }
}

export default RTWorker;