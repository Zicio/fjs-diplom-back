import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { IMarkMessagesAsReadDto } from './interfaces';

interface ISendMessageDto {
  author: Types.ObjectId;
  supportRequest: Types.ObjectId;
  text: string;
}

interface IGetChatListParams {
  user: Types.ObjectId | null;
  isActive: boolean;
  limit?: number;
  offset?: number;
}

interface ISupportRequestService {
  getSupportRequestById(id: Types.ObjectId): Promise<SupportRequest | null>;

  findSupportRequests(params: IGetChatListParams): Promise<SupportRequest[]>;

  sendMessage(data: ISendMessageDto): Promise<Message>;

  getMessages(
    supportRequest: Types.ObjectId,
    user: UserDocument,
  ): Promise<Message[]>;

  markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void>;

  subscribe(
    handler: (
      supportRequest: SupportRequest | null,
      message: Message | null,
    ) => void,
  ): () => void;
}

@Injectable()
export class SupportRequestsService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  //  Метод добавлен для работы SupportRequestAccessGuard
  async getSupportRequestById(
    id: Types.ObjectId,
  ): Promise<SupportRequest | null> {
    return this.supportRequestModel.findById(id);
  }

  async findSupportRequests(
    params: IGetChatListParams,
  ): Promise<SupportRequest[]> {
    const { user, isActive, limit, offset } = params;
    const query = this.supportRequestModel.find({ isActive });
    user && query.where('user').equals(user);
    return query
      .populate('user')
      .limit(limit ?? 0)
      .skip(offset ?? 0);
  }

  async sendMessage(data: ISendMessageDto): Promise<Message> {
    const message = new this.messageModel(data);
    await message.save();
    await this.supportRequestModel.updateOne(
      { _id: data.supportRequest },
      { $push: { messages: message.id } },
    );
    return message;
  }

  async getMessages(supportRequest: Types.ObjectId): Promise<Message[]> {
    const supportRequestData = await this.getSupportRequestById(supportRequest);
    const messagesIds = supportRequestData?.messages;
    return this.messageModel.find({ _id: { $in: messagesIds } });
  }

  async markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void> {
    const { user, supportRequest, createdBefore } = params;
    const supportRequestToUpdate = (await this.supportRequestModel
      .findById(supportRequest)
      .populate('messages')) as SupportRequestDocument & {
      messages: MessageDocument[];
    };

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

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ) {
    const changeStream = this.supportRequestModel.watch();

    changeStream.on('change', async (change) => {
      if (change.operationType === 'update') {
        const updatedFields = change.updateDescription.updatedFields;
        console.log({ updatedFields });
        if (
          Object.keys(updatedFields).length === 1 &&
          'messages' in updatedFields
        ) {
          const id = change.documentKey._id;
          const { messages }: { messages: Types.ObjectId[] } = updatedFields;
          const supportRequest = (await this.supportRequestModel.findById(
            id,
          )) as SupportRequestDocument;
          const latestMessage = messages[messages.length - 1];
          console.log({ latestMessage });

          if (latestMessage) {
            const message: Message | null = await this.messageModel
              .findById(latestMessage)
              .populate('author', 'id name');
            if (!message) {
              return;
            }
            handler(supportRequest, message);
          }
        }
      }
    });

    return () => changeStream.close();
  }
}
