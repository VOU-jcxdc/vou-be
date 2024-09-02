import { Test, TestingModule } from "@nestjs/testing";
import { QuizGameController } from "./quiz-game.controller";

describe("QuizGameController", () => {
  let controller: QuizGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizGameController],
    }).compile();

    controller = module.get<QuizGameController>(QuizGameController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
