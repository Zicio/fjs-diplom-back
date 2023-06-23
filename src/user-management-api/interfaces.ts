export interface ICreateUserResponse {
  id: number;
  email: string;
  name: string;
  contactPhone: string;
  role: string;
}

export interface IGetUsersResponse {
  id: number;
  email: string;
  name: string;
  contactPhone: string;
}
