import { Types } from 'mongoose';

export class MarkMessageAsReadDto {
  readonly user: Types.ObjectId;
  readonly supportRequest: Types.ObjectId;
  readonly createdBefore: Date;

  constructor(
    user: Types.ObjectId,
    supportRequest: Types.ObjectId,
    createdBefore: Date,
  ) {
    this.user = user;
    this.supportRequest = supportRequest;
    this.createdBefore = createdBefore;
  }
}
