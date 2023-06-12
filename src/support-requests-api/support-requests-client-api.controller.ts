import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { CreateSupportRequestDto } from './dto/createSupportRequest.dto';
import { IQueryGetSupportRequestsParams, ISupportRequest } from './interfaces';
import { Request } from 'express';
import { UserDocument } from '../users/schemas/user.schema';
import { SupportRequestsApiService } from './support-requests-api.service';

@Controller('api/client')
export class SupportRequestsClientApiController {
  constructor(
    private readonly supportRequestsClientApiService: SupportRequestsApiService,
  ) {}

  //  2.5.1. Создание обращения в поддержку
  @Post('support-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Client])
  async createSupportRequest(
    @Body() createSupportRequestDto: CreateSupportRequestDto,
    @Req() req: Request,
  ): Promise<ISupportRequest> {
    // В задании тип ответа стоит !!!массив!!! обращений. Почему?
    createSupportRequestDto.user = (req.user as UserDocument).id;
    return this.supportRequestsClientApiService.createSupportRequest(
      createSupportRequestDto,
    );
  }

  // 2.5.2. Получение списка обращений в поддержку для клиента
  @Get('support-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Client])
  async getSupportRequests(
    @Query() query: IQueryGetSupportRequestsParams,
    @Req() req: Request,
  ): Promise<ISupportRequest[]> {
    return this.supportRequestsClientApiService.getSupportRequests(
      query,
      req.user as UserDocument,
    );
  }
}
