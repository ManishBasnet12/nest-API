import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');

const server = express();
let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The API for the project')
      .setVersion('1.0')
      .addTag('api')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token only (without Bearer prefix)',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors({
      origin: ['https://nest-api-sigma.vercel.app', 'http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await app.init();
  }
  return server;
}

// CommonJS export for Vercel
module.exports = async (req: any, res: any) => {
  const expressApp = await bootstrap();
  expressApp(req, res);
};
