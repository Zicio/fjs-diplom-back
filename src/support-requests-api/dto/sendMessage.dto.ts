import { ID } from '../../globalType';

export class SendMessageDto {
  readonly author: ID;
  readonly supportRequest: ID;
  readonly text: string;

  constructor(author: ID, supportRequest: ID, text: string) {
    this.author = author;
    this.supportRequest = supportRequest;
    this.text = text;
  }
}
