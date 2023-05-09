import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Message } from './message.schema';

export type SupportRequestDocument = SupportRequest & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } }) // TODO : Проверить работу createdAt
export class SupportRequest {
  @Prop({ ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  messages: Message[];

  @Prop()
  isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
