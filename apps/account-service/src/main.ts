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
  const serverPort = process.env.SERVER_PORT || 3001;
  const microserviceHost = process.env.MICROSERVICE_HOST || "localhost";
  const microservicePort = Number(process.env.MICROSERVICE_PORT as string) || 8888;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: microserviceHost,
      port: microservicePort,
    },
  });

  await app.startAllMicroservices();
  await app.listen(serverPort);

  Logger.log(`🚀 Account application is running on: http://localhost:${serverPort}`);
}

bootstrap();
