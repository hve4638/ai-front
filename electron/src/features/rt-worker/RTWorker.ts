import { BrowserWindow } from 'electron';
import type { Profile } from '@/features/profiles';
import RTSender from './RTSender';
import { WorkflowPromptOnly } from './workflow';

class RTWorker {
    protected browserWindowRef:WeakRef<BrowserWindow>|null = null;

    setBrowserWindowRef(browserWindowRef:WeakRef<BrowserWindow>) {
        this.browserWindowRef = browserWindowRef;
    }

    async request(token:string, profile:Profile, rtInput:RTInput):Promise<string> {
        if (!this.browserWindowRef) {
            throw new Error('BrowserWindow reference is not set. Initialize is required.');
        }
        const rtSender = new RTSender(this.browserWindowRef, token);
        const rtId = rtInput.rtId;
        const result = await profile.getRTData(rtId, 'index.json', ['uuid']);

        console.log(result);
        
        const process = new WorkflowPromptOnly(rtSender, profile);
        process.process(rtInput);
        
        return token;
    }
}

export default RTWorker;