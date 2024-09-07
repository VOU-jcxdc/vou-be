import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import { AppModule } from "./modules/app/app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ExceptionHandlerInterceptor, ThrowFirstErrorValidationPipe, TransformResponseInterceptor } from "@utils";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microserviceHost = process.env.VOUCHER_SERVICE_HOST || "localhost";
  const microservicePort = Number(process.env.VOUCHER_SERVICE_PORT as string) || 3004;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: microserviceHost,
      port: microservicePort,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URLS],
      queue: process.env.RMQ_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });

  app.useGlobalInterceptors(new TransformResponseInterceptor(new Reflector()));
  app.useGlobalInterceptors(new ExceptionHandlerInterceptor());
  app.useGlobalPipes(ThrowFirstErrorValidationPipe);
  await app.startAllMicroservices();
  await app.init();

  Logger.log("🚀 Voucher application is running");
}

bootstrap();
