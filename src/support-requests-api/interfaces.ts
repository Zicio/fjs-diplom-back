import { Types } from 'mongoose';

export interface ISupportRequest {
  id: Types.ObjectId;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  client?: IClient;
}

export interface IQueryGetSupportRequestsParams {
  limit?: number;
  offset?: number;
  isActive: boolean;
}

export interface IMessage {
  id: Types.ObjectId;
  createdAt: string;
  text: string;
  readAt: string | null;
  author: IAuthor;
}

interface IAuthor {
  id: Types.ObjectId;
  name: string;
}

export interface IClient {
  id: Types.ObjectId;
  name: string;
  email: string;
  contactPhone: string;
}

export interface IMarkMessageAsReadResponse {
  success: boolean;
}
