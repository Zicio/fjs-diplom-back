import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationsModule } from './reservations/reservations.module';
import { SupportRequestModule } from './support-request/support-request.module';
import { AuthModule } from './auth/auth.module';
import { UserManagementModule } from './user-management/user-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://root:root@mongo:27017/',
      {
        dbName: 'atom',
      },
    ),
    UsersModule,
    HotelsModule,
    ReservationsModule,
    SupportRequestModule,
    AuthModule,
    UserManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
