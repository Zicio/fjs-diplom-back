import { Types } from 'mongoose';

export class CreateSupportRequestDto {
  readonly user: Types.ObjectId;
  readonly text: string;

  constructor(user: Types.ObjectId, text: string) {
    this.user = user;
    this.text = text;
  }
}
