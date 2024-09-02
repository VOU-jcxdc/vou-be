import { Test, TestingModule } from "@nestjs/testing";
import { QuizGameService } from "./quiz-game.service";

describe("QuizGameService", () => {
  let service: QuizGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizGameService],
    }).compile();

    service = module.get<QuizGameService>(QuizGameService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
