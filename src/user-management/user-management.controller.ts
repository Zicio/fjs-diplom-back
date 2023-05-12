import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserManagementService } from './user-management.service';

@Controller('api')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('admin/users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userManagementService.createUser(createUserDto);
  }

  @Get('admin/users')
  async getUsersAsAdmin(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('contactPhone') contactPhone: string,
  ) {
    return this.userManagementService.getUsers({
      limit,
      offset,
      name,
      email,
      contactPhone,
    });
  }

  @Get('manager/users')
  async getUsersAsManager(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('contactPhone') contactPhone: string,
  ) {
    return this.userManagementService.getUsers({
      limit,
      offset,
      name,
      email,
      contactPhone,
    });
  }
}
