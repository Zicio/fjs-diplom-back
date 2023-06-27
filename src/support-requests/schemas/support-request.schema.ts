import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SupportRequestDocument = SupportRequest & Document;

@Schema({ timestamps: { createdAt: 'createdAt' }, versionKey: false })
export class SupportRequest {
  @Prop({ ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], required: true })
  messages: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
