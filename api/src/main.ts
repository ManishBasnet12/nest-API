import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';

import express from 'express';

// 1. Create an Express instance
const expressApp = express();

async function bootstrap() {
  // 2. Pass the Express instance to NestJS
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // -------------------------
  // Swagger Configuration
  // -------------------------
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

  // -------------------------
  // Global Validation Pipe
  // -------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // -------------------------
  // CORS Setup
  // -------------------------
  app.enableCors({
    origin: ['http://localhost:3001', 'https://nest-api-sigma.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Initialize the app instead of listening on a port
  await app.init();
}

bootstrap();

// 4. Export the Express app for Vercel's serverless environment
export default expressApp;