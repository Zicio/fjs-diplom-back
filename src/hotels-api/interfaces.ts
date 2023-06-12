import { Types } from 'mongoose';

export interface IRoom {
  id: Types.ObjectId;
  description: string;
  images: string[];
  isEnabled?: boolean;
  hotel: {
    id: Types.ObjectId;
    title: string;
    description?: string;
  };
}

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
