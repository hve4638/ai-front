import { BrowserWindow } from 'electron';
import type { Profile } from '@/features/profiles';
import RTSender from './RTSender';
import { WorkflowPromptOnly } from './workflow';

class RTWorker {
    protected browserWindowRef:WeakRef<BrowserWindow>|null = null;

    setBrowserWindowRef(browserWindowRef:WeakRef<BrowserWindow>) {
        this.browserWindowRef = browserWindowRef;
    }

    async request(token:string, profile:Profile, sessionId:string):Promise<string> {
        if (!this.browserWindowRef) {
            throw new Error('BrowserWindow reference is not set. Initialize is required.');
        }

        const rtSender = new RTSender(this.browserWindowRef, token);
        const session = profile.session(sessionId);

        const { rt_id, model_id } = await session.get('config.json', ['rt_id', 'model_id']);
        const { input } = await session.get('cache.json', ['input']);
        const form = await session.getOne('data.json', `forms.${rt_id}`);

        const rt = profile.rt(rt_id);
        const { uuid } = await rt.getMetadata();

        const rtInput:RTInput = {
            rtId : rt_id,
            modelId: model_id,
            sessionId: sessionId,
            form : form ?? {},
            input : input ?? '',
            chat : [],
        }
        console.log('[RTInput]', rtInput);
        console.log('rt uuid:', uuid);
        
        const process = new WorkflowPromptOnly(rtSender, profile);
        process.process(rtInput);
        
        return token;
    }
}

export default RTWorker;