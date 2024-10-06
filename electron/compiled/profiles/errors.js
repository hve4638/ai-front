"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileError = void 0;
class ProfileError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ProfileError';
    }
}
exports.ProfileError = ProfileError;
