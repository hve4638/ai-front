class ChatAIError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ChatAIError';
    }
}

export default ChatAIError;