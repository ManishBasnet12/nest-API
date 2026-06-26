import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./app.module";

let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: [
        "https://vercel.com/manish-basnets-projects/nest-api",
        "http://localhost:3000",
      ],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
    });

    await app.init();
  }
  return app.getHttpAdapter().getInstance();
}

export default bootstrap();