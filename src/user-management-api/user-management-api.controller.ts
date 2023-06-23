import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserManagementApiService } from './user-management-api.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUsersDto } from './dto/getUsers.dto';
import { ICreateUserResponse, IGetUsersResponse } from './interfaces';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserManagementApiController {
  constructor(
    private readonly userManagementService: UserManagementApiService,
  ) {}

  @Post('admin/users')
  @Roles([Role.Admin])
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ICreateUserResponse> {
    return this.userManagementService.createUser(createUserDto);
  }

  @Get('admin/users')
  @Roles([Role.Admin])
  async getUsersAsAdmin(
    @Query() getUsersDto: GetUsersDto,
  ): Promise<IGetUsersResponse[]> {
    return this.userManagementService.getUsers(getUsersDto);
  }

  @Get('manager/users')
  @Roles([Role.Manager])
  async getUsersAsManager(
    @Query() getUsersDto: GetUsersDto,
  ): Promise<IGetUsersResponse[]> {
    return this.userManagementService.getUsers(getUsersDto);
  }
}
