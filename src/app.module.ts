import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { HotelsApiModule } from './hotels-api/hotels-api.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { SupportRequestsModule } from './support-requests/support-requests.module';
import { SupportRequestsApiModule } from './support-requests-api/support-requests-api.module';
import { UserManagementApiModule } from './user-management-api/user-management-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'uploads'),
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
    SupportRequestsModule,
    AuthModule,
    UserManagementApiModule,
    HotelsApiModule,
    // ReservationsApiModule,
    SupportRequestsApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
