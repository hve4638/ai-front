import { CBFResult, PromptGenerator } from '@hve/prompt-template';
import { ChatContents } from '../nodes/types';

class ChatGenerator extends PromptGenerator {
    chat: ChatContents[];

    constructor(chat: ChatContents[]) {
        super(function* () {
            for (const c of chat) {
                yield {
                    type: 'ROLE',
                    role: c.role,
                }
                yield {
                    type: 'TEXT',
                    text: c.contents.map((c) => c.value).join(''),
                } satisfies CBFResult;
            }
        })

        this.chat = chat;
    }
    
    indexor(index:number) {
        if (index >= this.chat.length) {
            throw new Error(`Index out of bounds: ${index}`);
        }
        return this.chat[index];
    }
}

export default ChatGenerator;