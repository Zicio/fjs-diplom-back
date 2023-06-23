import { Types } from 'mongoose';
import { Role } from '../../auth/roles.decorator';

export class MarkMessageAsReadDto {
  readonly user: Types.ObjectId;
  readonly role: Role;
  readonly supportRequest: Types.ObjectId;
  readonly createdBefore: Date;

  constructor(
    user: Types.ObjectId,
    role: Role,
    supportRequest: Types.ObjectId,
    createdBefore: Date,
  ) {
    this.user = user;
    this.role = role;
    this.supportRequest = supportRequest;
    this.createdBefore = createdBefore;
  }
}
