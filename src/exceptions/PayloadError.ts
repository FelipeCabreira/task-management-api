import { BadRequestError } from 'routing-controllers';

export class PayloadError extends BadRequestError {
  private messages: unknown[] | undefined;

  constructor(message: string = 'Invalid request payload', messages?: unknown[]) {
    super(message);
    this.name = 'Invalid request payload';
    this.messages = messages;
  }
}
