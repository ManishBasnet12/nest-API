// src/main.ts
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The API for the project')
      .setVersion('1.0')
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
      origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await app.init();
  }
  return app.getHttpAdapter().getInstance();
}

// For Vercel serverless function
export default async function handler(req: any, res: any) {
  const expressApp = await bootstrap();
  expressApp(req, res);
}

// For local development
if (!process.env.VERCEL) {
  async function startLocal() {
    const app = await NestFactory.create(AppModule);
    // ... same configuration
    await app.listen(3000);
  }
  startLocal();
}