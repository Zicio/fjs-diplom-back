import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { IQueryGetSupportRequestsParams, ISupportRequest } from './interfaces';
import { SupportRequestsApiService } from './support-requests-api.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { Request } from 'express';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('api/manager')
export class SupportRequestsManagerApiController {
  constructor(
    private readonly supportRequestsApiService: SupportRequestsApiService,
  ) {}

  //  2.5.3. Получение списка обращений в поддержку для менеджера
  @Get('manager/support-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Manager])
  async getSupportRequestsForManager(
    @Query() query: IQueryGetSupportRequestsParams,
    @Req() req: Request,
  ): Promise<ISupportRequest[]> {
    return this.supportRequestsApiService.getSupportRequests(
      query,
      req.user as UserDocument,
    );
  }
}
