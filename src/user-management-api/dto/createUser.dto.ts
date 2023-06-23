import { Role } from '../../auth/roles.decorator';

export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly contactPhone: string;
  readonly role: Role;
}
