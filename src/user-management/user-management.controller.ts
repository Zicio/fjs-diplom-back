import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserManagementService } from './user-management.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export interface IQueryParams {
  limit: number;
  offset: number;
  name: string;
  email: string;
  contactPhone: string;
}

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('admin/users')
  @Roles([Role.Admin])
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userManagementService.createUser(createUserDto);
  }

  @Get('admin/users')
  @Roles([Role.Admin])
  async getUsersAsAdmin(@Query() query: IQueryParams) {
    return this.userManagementService.getUsers(query);
  }

  @Get('manager/users')
  @Roles([Role.Manager])
  async getUsersAsManager(@Query() query: IQueryParams) {
    return this.userManagementService.getUsers(query);
  }
}
