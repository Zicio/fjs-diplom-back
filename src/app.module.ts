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
import { HotelsApiModule } from './hotels-api/hotels-api.module';
import { MulterModule } from '@nestjs/platform-express';

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
    MulterModule.register({ dest: './uploads' }),
    UsersModule,
    HotelsModule,
    ReservationsModule,
    SupportRequestModule,
    AuthModule,
    UserManagementModule,
    HotelsApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
