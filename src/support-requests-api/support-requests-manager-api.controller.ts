import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IQueryGetSupportRequestsParams, ISupportRequest } from './interfaces';
import { SupportRequestsApiService } from './support-requests-api.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, Roles } from '../auth/roles.decorator';

@Controller('api/manager/support-requests')
export class SupportRequestsManagerApiController {
  constructor(
    private readonly supportRequestsApiService: SupportRequestsApiService,
  ) {}

  //  2.5.3. Получение списка обращений в поддержку для менеджера
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Manager])
  async getSupportRequestsForManager(
    @Query() query: IQueryGetSupportRequestsParams,
  ): Promise<ISupportRequest[]> {
    return this.supportRequestsApiService.getSupportRequests(query, null);
  }
}
