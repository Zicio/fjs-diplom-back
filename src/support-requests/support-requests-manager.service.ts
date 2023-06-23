import { Injectable } from '@nestjs/common';
import { IMarkMessagesAsReadDto } from './interfaces';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';

export interface ISupportRequestManagerService {
  markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void>;

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

  async markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void> {
    try {
      const { user, supportRequest, createdBefore } = params;
      const supportRequestToUpdate = await this.supportRequestModel
        .findById(supportRequest)
        .populate('messages');

      if (!supportRequestToUpdate) {
        throw new Error('Support request not found');
      } else {
        const messages = supportRequestToUpdate.messages;
        const messagesToMark = messages.filter((message: MessageDocument) => {
          return (
            message.author === user &&
            !message.readAt &&
            message.sentAt < createdBefore
          );
        });

        const messageIdToMark: Types.ObjectId[] = messagesToMark.map(
          (message: MessageDocument) => {
            return message._id;
          },
        );

        await this.messageModel.updateMany(
          { _id: { $in: messageIdToMark } },
          { readAt: new Date() },
        );

        await supportRequestToUpdate.save();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]> {
    const supportRequestToReceipt = await this.supportRequestModel.findById(
      supportRequest,
    );
    if (!supportRequestToReceipt) {
      throw new Error('Support request not found');
    } else {
      const messages = supportRequestToReceipt.messages;
      return messages.filter((message: MessageDocument) => {
        return (
          !message.readAt && message.author === supportRequestToReceipt.user
        ); // TODO в задании сказано возврат именно количества сообщений, но в интерфейсе идет возврат массива сообщении
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
