import { Types } from 'mongoose';

export class SendMessageDto {
  readonly author: Types.ObjectId;
  readonly supportRequest: Types.ObjectId;
  readonly text: string;

  constructor(
    author: Types.ObjectId,
    supportRequest: Types.ObjectId,
    text: string,
  ) {
    this.author = author;
    this.supportRequest = supportRequest;
    this.text = text;
  }
}
