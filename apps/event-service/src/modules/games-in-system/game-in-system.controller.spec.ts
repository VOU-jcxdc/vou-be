import { Test, TestingModule } from "@nestjs/testing";
import { GameInSystemController } from "./game-in-system.controller";

describe("GameInSystemController", () => {
  let controller: GameInSystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameInSystemController],
    }).compile();

    controller = module.get<GameInSystemController>(GameInSystemController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
