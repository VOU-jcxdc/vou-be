import { Test, TestingModule } from "@nestjs/testing";
import { GameInSystemService } from "./game-in-system.service";

describe("GameInSystemService", () => {
  let service: GameInSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameInSystemService],
    }).compile();

    service = module.get<GameInSystemService>(GameInSystemService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
