import { BrowserWindow } from 'electron';
import type { Profile } from '@/features/profiles';
import RTSender from './RTSender';
import { WorkflowPromptOnly } from './workflow';
import runtime from '@/runtime';

class RTWorker {
    static senders = new Map<string, RTSender>();
    protected browserWindowRef: WeakRef<BrowserWindow> | null = null;

    setBrowserWindowRef(browserWindowRef: WeakRef<BrowserWindow>) {
        this.browserWindowRef = browserWindowRef;
    }

    async request(token: string, profile: Profile, sessionId: string): Promise<string> {
        if (!this.browserWindowRef) {
            throw new Error('BrowserWindow reference is not set. Initialize is required.');
        }
        if (RTWorker.senders.has(token)) {
            runtime.logger.error(`RTWork failed: duplicate token`, token);
            throw new Error(`Duplicate token: ${token}`);
        }

        const session = profile.session(sessionId);

        const { rt_id, model_id } = await session.get('config.json', ['rt_id', 'model_id']);
        const { input } = await session.get('cache.json', ['input']);
        const form = await session.getOne('data.json', `forms.${rt_id}`);

        const rtInput: RTInput = {
            rtId: rt_id,
            modelId: model_id,
            sessionId: sessionId,
            form: form ?? {},
            input: input ?? '',
            chat: [],
        }

        runtime.logger.trace(`RT request started (${token})`)
        const rtSender = new RTSender(this.browserWindowRef, token);
        const process = new WorkflowPromptOnly(rtSender, profile);
        
        RTWorker.senders.set(token, rtSender);
        process.process(rtInput)
            .then(() => {
                runtime.logger.info(`RT request completed (${token})`);
            })
            .catch((error) => {
                runtime.logger.info(`RT request failed (${token})`);
            })
            .finally(() => {
                rtSender.sendClose();
                RTWorker.senders.delete(token);
            });

        return token;
    }
}

export default RTWorker;