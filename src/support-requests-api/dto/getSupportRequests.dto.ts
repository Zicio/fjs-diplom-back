import { Types } from 'mongoose';
import { IQueryGetSupportRequestsParams } from '../interfaces';

export class GetSupportRequestsDto {
  readonly user: Types.ObjectId | null;
  readonly isActive: boolean;
  readonly limit?: number;
  readonly offset?: number;

  constructor(
    user: Types.ObjectId | null,
    query: IQueryGetSupportRequestsParams,
  ) {
    const { isActive, limit, offset } = query;
    this.user = user;
    this.isActive = isActive;
    this.limit = limit;
    this.offset = offset;
  }
}
