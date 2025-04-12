import { BrowserWindow } from 'electron';
import { v7 as uuidv7 } from 'uuid';
import type { Profile } from '@/features/profiles';
import MirrorProcess from './workflow/WorkflowMirror';
import { GlobalRTFlowData } from './types';
import RTSender from './RTSender';
import { WorkflowPromptOnly } from './workflow';

class RTWorker {
    protected browserWindowRef:WeakRef<BrowserWindow>|null = null;

    setBrowserWindowRef(browserWindowRef:WeakRef<BrowserWindow>) {
        this.browserWindowRef = browserWindowRef;
    }

    async request(token:string, profile:Profile, rtId:string, input:RTInput):Promise<string> {
        if (!this.browserWindowRef) {
            throw new Error('BrowserWindow reference is not set. Initialize is required.');
        }
        const rtSender = new RTSender(this.browserWindowRef, token);
        const rtFlowData:GlobalRTFlowData = {
            profile,
            rtId,
            modelId: input.modelId,
        }
        
        // const process = new MirrorProcess(rtSender, rtFlowData);
        const process = new WorkflowPromptOnly(rtSender, rtFlowData);
        process.process(input);
        
        return token;
    }
}

export default RTWorker;