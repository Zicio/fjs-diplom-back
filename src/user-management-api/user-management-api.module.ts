import { Module } from '@nestjs/common';
import { UserManagementApiController } from './user-management-api.controller';
import { UserManagementApiService } from './user-management-api.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UserManagementApiController],
  providers: [UserManagementApiService],
})
export class UserManagementApiModule {}
