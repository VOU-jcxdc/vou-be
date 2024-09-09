import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AiEndpointService {
  private endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.get<string>("AI_ENDPOINT");
  }

  getAIEndpoint() {
    return this.endpoint;
  }
}
