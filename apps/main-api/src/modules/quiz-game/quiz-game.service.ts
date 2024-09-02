import { Injectable } from "@nestjs/common";
<<<<<<< HEAD

@Injectable()
export class QuizGameService {}
=======
import { QuizGameGateway } from "../socket/quiz-game.gateway";

@Injectable()
export class QuizGameService {
  constructor(private readonly quizGameGateWay: QuizGameGateway) {}
}
>>>>>>> f01da73 (feat(vou-84): setup socket gateway)
