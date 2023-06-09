import { SetMetadata } from '@nestjs/common';

export enum Role {
  Client = 'client',
  Admin = 'admin',
  Manager = 'manager',
}

export const ROLES_KEY = process.env.ROLES_KEY || 'role';

export const Roles = (roles: Role[]) => SetMetadata(ROLES_KEY, roles);
