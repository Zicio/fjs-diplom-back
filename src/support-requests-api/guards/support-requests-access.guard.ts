import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDocument } from '../../users/schemas/user.schema';
import { Types } from 'mongoose';
import { SupportRequest } from '../../support-requests/schemas/support-request.schema';
import { Role } from '../../auth/roles.decorator';
import { SupportRequestsService } from '../../support-requests/support-requests.service';

@Injectable()
export class SupportRequestsAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserDocument = request.user;
    const supportRequestId: Types.ObjectId = request.params.id;

    if (user.role === Role.Manager) {
      return true;
    }

    const supportRequest: SupportRequest | null =
      await this.supportRequestsService.getSupportRequestById(supportRequestId);
    if (supportRequest) {
      if (user.id !== supportRequest.user) {
        throw new ForbiddenException('Отсутствуют необходимые права доступа');
      }
      return true;
    }
    throw new NotFoundException('Запрос не найден');
  }
}
