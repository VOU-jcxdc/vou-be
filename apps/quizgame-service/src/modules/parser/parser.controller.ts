import { Controller } from "@nestjs/common";
import { ParserService } from "./parser.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { IQAs } from "@types";

@Controller()
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @MessagePattern({ method: "POST", path: "/quiz-game/questions" })
  async createQuestions(@Payload() data: { data: IQAs[]; eventId: string }) {
    return this.parserService.createQuestions(data);
  }

  @MessagePattern({ method: "GET", path: "/events/:id/questions" })
  async getQuestionsInEvent(@Payload() { id }: { id: string }) {
    return this.parserService.getQuestionsInEvent(id);
  }
}
