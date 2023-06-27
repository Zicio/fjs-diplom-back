import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema({ versionKey: false })
export class Message {
  @Prop({ ref: User.name, required: true })
  author: Types.ObjectId;

  @Prop({ required: true, default: new Date() })
  sentAt: Date;

  @Prop({ required: true })
  text: string;

  @Prop({ default: null })
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
