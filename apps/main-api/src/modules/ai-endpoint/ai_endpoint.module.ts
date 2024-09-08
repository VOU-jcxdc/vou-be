import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AIEndpointController } from "./ai_endpoint.constroller";

@Module({
  imports: [ConfigModule],
  controllers: [AIEndpointController],
})
export class AIEndpointModule {}
