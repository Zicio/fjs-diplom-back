import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AccessJWTStrategy } from './accessJWT.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RegistrationController } from './registration.controller';
import { AuthService } from './auth.service';
import { RefreshJWTStrategy } from './refreshJWT.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController, RegistrationController],
  providers: [AccessJWTStrategy, RefreshJWTStrategy, AuthService],
})
export class AuthModule {}
