import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
      'access-token', // This name is used in @ApiBearerAuth()
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
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // -------------------------
  // Start Server
  // -------------------------
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();