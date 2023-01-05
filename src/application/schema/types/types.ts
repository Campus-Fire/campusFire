import { Message } from './schema';

interface Root {}

interface SendMessagePayload {
  message: Message;
}

export { Root, SendMessagePayload };
