export class CryptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CryptError';
  }
}