import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { QuizgameConfigService } from "./config.service";
import { AddConfigsDto } from "@types";

@Controller()
export class QuizgameConfigController {
  constructor(private readonly quizgameConfigService: QuizgameConfigService) {}

  @MessagePattern({ method: "GET", path: "/events/:eventId/configs" })
  async getConfigsInEvent(@Payload() data: { eventId: string; userId: string }) {
    return this.quizgameConfigService.getConfigsInEvent(data);
  }

  @MessagePattern({ method: "POST", path: "/events/configs" })
  async addConfigsInEvent(@Payload() data: AddConfigsDto & { userId: string }) {
    return this.quizgameConfigService.addConfigsInEvent(data);
  }
}
