import { Types } from 'mongoose';

export class CreateRoomDto {
  readonly description: string;
  readonly hotel: Types.ObjectId;
  images: Express.Multer.File[];
}
