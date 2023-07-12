import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RegistrationController } from './registration.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'SECRETIK',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES || '24h',
      },
    }),
  ],
  controllers: [AuthController, RegistrationController],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule {}
