import { Types } from 'mongoose';

export class UpdateRoomDto {
  description: string;
  hotel: Types.ObjectId;
  isEnabled: boolean;
  images: Array<Express.Multer.File | string>;
}
