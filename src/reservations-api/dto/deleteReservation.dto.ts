import { ID } from '../../globalType';

export class DeleteReservationDto {
  readonly id: ID;
  readonly user: ID;

  constructor(id: ID, user: ID) {
    this.id = id;
    this.user = user;
  }
}
