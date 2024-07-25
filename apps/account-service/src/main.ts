import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./modules/app/app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microserviceHost = process.env.MICROSERVICE_HOST || "localhost";
  const microservicePort = Number(process.env.MICROSERVICE_PORT as string) || 3001;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: microserviceHost,
      port: microservicePort,
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.init();

  Logger.log("🚀 Account application is running");
}

bootstrap();
