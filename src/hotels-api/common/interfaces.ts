import { Types } from 'mongoose';

export interface IQueryGetRoomsParams {
  limit: number;
  offset: number;
  hotel: Types.ObjectId;
}

export interface IRoomParams {
  description: string;
  hotel: Types.ObjectId;
  images: string[];
}
