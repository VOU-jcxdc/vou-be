import { Injectable } from "@nestjs/common";
import { QuizGameGateway } from "../socket/quiz-game.gateway";

@Injectable()
export class QuizGameService {
  constructor(private readonly quizGameGateWay: QuizGameGateway) {}
}
