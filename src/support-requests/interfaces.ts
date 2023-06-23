import { Types } from 'mongoose';

export interface IMarkMessagesAsReadDto {
  user: Types.ObjectId;
  supportRequest: Types.ObjectId;
  createdBefore: Date;
}
