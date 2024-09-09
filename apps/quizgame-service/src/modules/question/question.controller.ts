import { Controller } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { IQAs, RoomGameStatus } from "@types";

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @MessagePattern({ method: "POST", path: "/quiz-game/questions" })
  async createQuestions(@Payload() data: { data: IQAs[]; eventId: string }) {
    return this.questionService.createQuestions(data);
  }

  @MessagePattern({ method: "POST", path: "/quiz-game/room-game" })
  async createRoomGame(@Payload() data: { eventId: string }) {
    return this.questionService.createRoomGame(data.eventId);
  }

  @MessagePattern({ method: "GET", path: "/events/:eventId/questions" })
  async getQuestionsInEvent(@Payload() { id }: { id: string }) {
    return this.questionService.getQuestionsInEvent(id);
  }

  @MessagePattern({ method: "GET", path: "/events/:eventId/room-game" })
  async getRoomGame(@Payload() { eventId }: { eventId: string }) {
    return this.questionService.getRoomGame(eventId);
  }

  @MessagePattern({ method: "GET", path: "/quiz-game/questions/:roomId" })
  async getQuestionsInRoomGame(@Payload() { roomId }: { roomId: string }) {
    return this.questionService.getQuestionsInRoomGame(roomId);
  }

  @MessagePattern({ method: "PUT", path: "/quiz-game/room-game/:roomId" })
  async updateRoomGame(
    @Payload() { roomId, status, players }: { roomId: string; status: RoomGameStatus; players: string[] }
  ) {
    return this.questionService.updateRoomGame(roomId, { status, players });
  }
}
