/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./modules/app/app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microserviceHost = process.env.QUIZGAME_SERVICE_HOST || "localhost";
  const microservicePort = Number(process.env.QUIZGAME_SERVICE_PORT as string) || 3007;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: microserviceHost,
      port: microservicePort,
    },
  });

  await app.startAllMicroservices();
  await app.init();

  Logger.log(`🚀 Quizgame application is running`);
}

bootstrap();
