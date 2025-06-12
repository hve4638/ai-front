export class RTClosed extends Error {
    constructor() {
        super('RT session closed');
    }
}