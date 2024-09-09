import { Controller, Get } from "@nestjs/common";
import { AiEndpointService } from "./ai_endpoint.service";

@Controller("ai-endpoints")
export class AIEndpointController {
  constructor(private readonly aiEndpointService: AiEndpointService) {}

  @Get()
  async getAIEndpoint() {
    return this.aiEndpointService.getAIEndpoint();
  }
}
