import { Test, TestingModule } from "@nestjs/testing";
import { QuizGameGateway } from "./quiz-game.gateway";

describe("QuizGameGateway", () => {
  let gateway: QuizGameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizGameGateway],
    }).compile();

    gateway = module.get<QuizGameGateway>(QuizGameGateway);
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });
});
