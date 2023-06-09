import { Types } from 'mongoose';

export interface IQueryGetHotelsParams {
  limit: number;
  offset: number;
  title: string;
}

export interface IHotel {
  id: Types.ObjectId;
  title: string;
  description: string;
}
