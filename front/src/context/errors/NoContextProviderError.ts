class NoContextProviderError extends Error {
    constructor(contextProviderName?:string) {
        let message;
        if (contextProviderName) {
            message = 'No context provider found: ' + contextProviderName;
        }
        else {
            message = 'No context provider found';
        }
        
        super(message);
        this.name = 'NoContextProviderError';
    }
}

export default NoContextProviderError;