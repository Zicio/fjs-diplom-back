import { Types } from 'mongoose';

export class CreateRoomDto {
  description: string;
  hotel: Types.ObjectId;
  images: Express.Multer.File[];
}
