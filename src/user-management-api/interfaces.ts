import { ID } from '../globalType';

export interface ICreateUserResponse {
  id: ID;
  email: string;
  name: string;
  contactPhone: string;
  role: string;
}

export interface IGetUsersResponse {
  id: ID;
  email: string;
  name: string;
  contactPhone: string;
}
