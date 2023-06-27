import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';

export interface ISupportRequestManagerService {
  getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]>;

  closeRequest(supportRequest: Types.ObjectId): Promise<SupportRequest | null>;
}

@Injectable()
export class SupportRequestsManagerService
  implements ISupportRequestManagerService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]> {
    const supportRequestToReceipt = (await this.supportRequestModel
      .findById(supportRequest)
      .populate('messages')) as SupportRequestDocument & {
      messages: MessageDocument[];
    };
    if (!supportRequestToReceipt) {
      throw new Error('Support request not found');
    } else {
      const messages = supportRequestToReceipt.messages;
      return messages.filter((message: MessageDocument) => {
        return (
          !message.readAt && message.author === supportRequestToReceipt.user
        );
      });
    }
  }

  async closeRequest(
    supportRequest: Types.ObjectId,
  ): Promise<SupportRequest | null> {
    return this.supportRequestModel.findByIdAndUpdate(supportRequest, {
      isActive: false,
    });
  }
}
