export class ProfileError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProfileError';
  }
}