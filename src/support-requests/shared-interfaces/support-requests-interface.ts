import { Types } from 'mongoose';

export interface MarkMessagesAsReadDto {
  user: Types.ObjectId;
  supportRequest: Types.ObjectId;
  createdBefore: Date;
}
