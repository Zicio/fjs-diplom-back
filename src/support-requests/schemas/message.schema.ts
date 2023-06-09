import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ ref: User.name, required: true })
  author: Types.ObjectId;

  @Prop({ required: true, default: new Date() }) // TODO: check default
  sentAt: Date;

  @Prop({ required: true })
  text: string;

  @Prop()
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
