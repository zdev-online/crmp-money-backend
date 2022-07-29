import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const is_dev = process.env.NODE_ENV == 'development';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (is_dev) {
    const config = new DocumentBuilder()
      .setTitle('CRMP Money')
      .setDescription('The CRMP Money API description')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      customSiteTitle: 'CRMP Money API',
    });
  }

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableCircularCheck: true,
      enableImplicitConversion: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      // stopAtFirstError: true,
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) =>
        new BadRequestException({
          message: 'Ошибка валидации данных',
          errors: errors
            .map((error) =>
              Object.keys(error.constraints).map((key) => ({
                property: error.property,
                reason: error.constraints[key],
              })),
            )
            .flat(Infinity),
        }),
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_HOST,
    credentials: true,
  });
  app.use(helmet(), cookieParser());

  await app.listen(process.env.PORT);
}
bootstrap();
