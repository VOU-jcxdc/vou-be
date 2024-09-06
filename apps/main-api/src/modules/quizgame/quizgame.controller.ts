import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Multer } from "multer";
import { QuizgameService } from "./quizgame.service";

@Controller("quiz-game")
export class QuizgameController {
  constructor(private readonly quizgameService: QuizgameService) {}

  @Post("questions")
  @UseInterceptors(FileInterceptor("file"))
  async createQuestions(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: "text/csv",
          }),
        ],
      })
    )
    file: Express.Multer.File,
    @Body("eventId") eventId: string
  ) {
    return this.quizgameService.createQuestions(eventId, file);
  }

  @Get("questions")
  async getQuestionsInRoomGame(@Query("roomId") roomId: string) {
    return this.quizgameService.getQuestionsInRoomGame(roomId);
  }
}
