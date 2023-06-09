import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RegistrationController } from './registration/registration.controller';
import { RegistrationService } from './registration/registration.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRETIK',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES || '24h',
      },
    }),
  ],
  controllers: [AuthController, RegistrationController],
  providers: [JwtStrategy, AuthService, RegistrationService],
})
export class AuthModule {}
