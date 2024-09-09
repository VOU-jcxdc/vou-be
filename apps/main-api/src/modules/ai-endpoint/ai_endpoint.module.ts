import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AIEndpointController } from "./ai_endpoint.controller";
import { AiEndpointService } from "./ai_endpoint.service";

@Module({
  imports: [ConfigModule],
  providers: [AiEndpointService],
  controllers: [AIEndpointController],
})
export class AIEndpointModule {}
