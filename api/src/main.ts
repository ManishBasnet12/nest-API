// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let app: any;

async function bootstrap() {
  if (!app) {
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server)
    );

    // Swagger configuration
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

    const document = SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('api', nestApp, document);

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    nestApp.enableCors({
      origin: [
        'https://your-frontend-url.vercel.app',
        'http://localhost:3000'
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await nestApp.init();
    app = nestApp.getHttpAdapter().getInstance();
  }
  return app;
}

// For Vercel serverless function
export default async function handler(req: any, res: any) {
  const expressApp = await bootstrap();
  expressApp(req, res);
}

// For local development
if (!process.env.VERCEL) {
  async function startLocal() {
    const nestApp = await NestFactory.create(AppModule);
    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    nestApp.enableCors({
      origin: ['http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    await nestApp.listen(3000);
    console.log('Application is running on: http://localhost:3000');
  }
  startLocal();
}