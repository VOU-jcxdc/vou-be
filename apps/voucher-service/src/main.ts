import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import { AppModule } from "./modules/app/app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ExceptionHandlerInterceptor, ThrowFirstErrorValidationPipe, TransformResponseInterceptor } from "@utils";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microserviceHost = process.env.MICROSERVICE_HOST || "localhost";
  const microservicePort = Number(process.env.MICROSERVICE_PORT as string) || 3004;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: microserviceHost,
      port: microservicePort,
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
