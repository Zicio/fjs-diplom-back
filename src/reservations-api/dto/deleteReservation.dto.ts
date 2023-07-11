import { ID } from '../../globalType';

export class DeleteReservationDto {
  readonly id: ID;
  readonly user: ID | null;

  constructor(id: ID, user: ID | null) {
    this.id = id;
    this.user = user;
  }
}
