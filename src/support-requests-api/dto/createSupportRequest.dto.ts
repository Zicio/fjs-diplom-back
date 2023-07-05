import { ID } from '../../globalType';

export class CreateSupportRequestDto {
  readonly user: ID;
  readonly text: string;

  constructor(user: ID, text: string) {
    this.user = user;
    this.text = text;
  }
}
