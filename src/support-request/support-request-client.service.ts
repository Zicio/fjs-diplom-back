import { Injectable } from '@nestjs/common';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MarkMessagesAsReadDto } from './interfaces/support-request-interface';

interface CreateSupportRequestDto {
  user: Types.ObjectId;
  text: string;
}

interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;

  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;

  getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]>;
}

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const supportRequest = new this.supportRequestModel(data);
    return supportRequest.save();
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
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
            message.author !== user &&
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
          !message.readAt && message.author !== supportRequestToReceipt.user
        ); // TODO в задании сказано возврат именно количества сообщений, но в интерфейсе идет возврат массива сообщении
      });
    }
  }
}
