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
  hotel: Types.ObjectId;
  limit?: number;
  offset?: number;
}

export interface IRoomParams {
  description: string;
  hotel: Types.ObjectId;
  images: string[];
}

export interface IHotel {
  id: Types.ObjectId;
  title: string;
  description: string;
}

export interface IGetHotelsBody {
  title: string;
  description: string;
}

export interface IUpdateRoomBody {
  description: string;
  hotel: Types.ObjectId;
  isEnabled: boolean;
  images: Array<Express.Multer.File | string>;
}
