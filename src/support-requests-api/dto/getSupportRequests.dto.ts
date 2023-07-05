import { IQueryGetSupportRequestsParams } from '../interfaces';
import { ID } from '../../globalType';

export class GetSupportRequestsDto {
  readonly user: ID | null;
  readonly isActive: boolean;
  readonly limit?: number;
  readonly offset?: number;

  constructor(user: ID | null, query: IQueryGetSupportRequestsParams) {
    const { isActive, limit, offset } = query;
    this.user = user;
    this.isActive = isActive;
    this.limit = limit;
    this.offset = offset;
  }
}
