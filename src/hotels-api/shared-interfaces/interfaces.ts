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
