import { Module } from "@nestjs/common";
import { WSAuthMiddleware } from "./socket.middware";

@Module({
  exports: [WSAuthMiddleware],
})
export class MiddlewareModule {}
