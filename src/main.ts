import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { LoggingInterceptor } from './logging.interceptor';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(cookieParser());
  await app.listen(PORT, () => {
    console.log(`Server started on port = ${PORT}`);
  });
}

bootstrap();
