// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '../../../generated/prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { Pool } from 'pg';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   constructor() {
//     const connectionString = process.env.DATABASE_URL;
//     const poolOptions: any = {
//       connectionString,
//       max: parseInt(process.env.DB_POOL_SIZE || '20', 10),
//       idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
//     };
//     if (process.env.DB_PASSWORD) {
//       poolOptions.password = String(process.env.DB_PASSWORD);
//     }
//     const pool = new Pool(poolOptions);
//     const adapter = new PrismaPg(pool);

//     super({
//       adapter,
//       log: ['error', 'warn'],
//     } as any);
//   }

//   async onModuleInit() {
//     await this.$connect();
//   }
// }

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { AppModule } from 'src/app.module';

const server = express();
let isInitialized = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

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
    origin: ['http://localhost:3001', 'https://nest-api-sigma.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.init();
}

export default async function handler(req, res) {
  if (!isInitialized) {
    await bootstrap();
    isInitialized = true;
  }
  server(req, res);
}
