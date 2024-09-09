import { Controller } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { IQAs } from "@types";

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @MessagePattern({ method: "POST", path: "/quiz-game/questions" })
  async createQuestions(@Payload() data: { data: IQAs[]; eventId: string }) {
    return this.questionService.createQuestions(data);
  }

  @MessagePattern({ method: "GET", path: "/events/:eventId/questions" })
  async getQuestionsInEvent(@Payload() { id }: { id: string }) {
    return this.questionService.getQuestionsInEvent(id);
  }

  @MessagePattern({ method: "GET", path: "/quiz-game/questions/:roomId" })
  async getQuestionsInRoomGame(@Payload() { roomId }: { roomId: string }) {
    return this.questionService.getQuestionsInRoomGame(roomId);
  }
}
