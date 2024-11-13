import { RequestForm, MODELS, ChatRole } from '../';
import { Message } from '../types/request-form';

export function bot(textMessage:string):Message {
    return {
        role: ChatRole.BOT,
        content: [
            {
                chatType: 'TEXT',
                text: textMessage,
            },
        ]
    }
}
export function user(textMessage:string):Message {
    return {
        role: ChatRole.USER,
        content: [
            {
                chatType: 'TEXT',
                text: textMessage,
            },
        ]
    }
}
export function system(textMessage:string):Message {
    return {
        role: ChatRole.SYSTEM,
        content: [
            {
                chatType: 'TEXT',
                text: textMessage,
            },
        ]
    }
}