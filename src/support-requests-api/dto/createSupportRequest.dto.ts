import { Types } from 'mongoose';

export class CreateSupportRequestDto {
  user: Types.ObjectId;
  text: string;
}
