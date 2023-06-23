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
import { IQueryGetSupportRequestsParams, ISupportRequest } from './interfaces';
import { Request } from 'express';
import { UserDocument } from '../users/schemas/user.schema';
import { SupportRequestsApiService } from './support-requests-api.service';
import { GetSupportRequestsDto } from './dto/getSupportRequests.dto';
import { CreateSupportRequestDto } from './dto/createSupportRequest.dto';

@Controller('api/client/support-requests')
export class SupportRequestsClientApiController {
  constructor(
    private readonly supportRequestsApiService: SupportRequestsApiService,
  ) {}

  //  2.5.1. Создание обращения в поддержку
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Client])
  async createSupportRequest(
    @Body() body: { text: string },
    @Req() req: Request & { user: UserDocument },
  ): Promise<ISupportRequest> {
    // TODO: В задании тип ответа стоит !!!массив!!! обращений. Почему?
    const createSupportRequestDto = new CreateSupportRequestDto(
      req.user.id,
      body.text,
    );
    return this.supportRequestsApiService.createSupportRequest(
      createSupportRequestDto,
    );
  }

  // 2.5.2. Получение списка обращений в поддержку для клиента
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Client])
  async getSupportRequests(
    @Query() query: IQueryGetSupportRequestsParams,
    @Req() req: Request & { user: UserDocument },
  ): Promise<ISupportRequest[]> {
    const getSupportRequestsDto = new GetSupportRequestsDto(req.user.id, query);
    return this.supportRequestsApiService.getSupportRequests(
      getSupportRequestsDto,
    );
  }
}
