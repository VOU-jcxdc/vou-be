/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import { AppModule } from "./modules/app/app.module";
import { ExceptionHandlerInterceptor, ThrowFirstErrorValidationPipe, TransformResponseInterceptor } from "@utils";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new TransformResponseInterceptor(new Reflector()));
  app.useGlobalInterceptors(new ExceptionHandlerInterceptor());
  app.useGlobalPipes(ThrowFirstErrorValidationPipe);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Main application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
