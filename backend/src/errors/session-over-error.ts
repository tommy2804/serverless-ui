import { CustomError } from './custom-error';

export class SessionOverError extends CustomError {
  statusCode = 401;
  constructor(message?: string) {
    super('Your Session is over please log in');
    Object.setPrototypeOf(this, SessionOverError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: 'Your Session is over please log in',
        custom_message: this.message,
      },
    ];
  }
}
