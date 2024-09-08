import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller("ai-endpoints")
export class AIEndpointController {
  private endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.get<string>("AI_ENDPOINT");
  }

  @Get()
  async getAIEndpoint() {
    return this.endpoint;
  }
}
