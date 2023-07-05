import { ID } from '../globalType';

export interface IMarkMessagesAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}
