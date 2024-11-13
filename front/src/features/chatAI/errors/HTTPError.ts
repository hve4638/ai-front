class HTTPError extends Error {
    constructor(response: Response, reason?:string) {
        const statusMessage = `${response.status} ${response.statusText}`
        const message = reason ? `${statusMessage}\n${reason}` : statusMessage;
        
        super(message);
        this.name = 'HTTPError';
    }
}

export default HTTPError;