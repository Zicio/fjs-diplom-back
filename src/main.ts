import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './logging.interceptor';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('FJS-diploma | Backend')
    .setDescription('Documentation for backend')
    .setVersion('1.0')
    .addTag('Zicio')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(cookieParser());
  await app.listen(PORT, () => {
    console.log(`Server started on port = ${PORT}`);
  });
}

bootstrap();
