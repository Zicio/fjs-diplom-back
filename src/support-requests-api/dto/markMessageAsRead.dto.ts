import { ID } from '../../globalType';

export class MarkMessageAsReadDto {
  readonly user: ID;
  readonly supportRequest: ID;
  readonly createdBefore: Date;

  constructor(user: ID, supportRequest: ID, createdBefore: Date) {
    this.user = user;
    this.supportRequest = supportRequest;
    this.createdBefore = createdBefore;
  }
}
