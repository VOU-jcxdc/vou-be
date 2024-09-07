import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { QUIZGAME_SERVICE_PROVIDER_NAME } from "@types";
import { CsvParser, ParsedData } from "nest-csv-parser";
import { catchError, lastValueFrom } from "rxjs";
import { Readable } from "stream";

class QAData {
  question: string;
  options: string;
  answer: string;
}

@Injectable()
export class QuizgameService {
  private quizgameClient: ClientProxy;
  private readonly logger = new Logger(QuizgameService.name);

  constructor(
    @Inject(QUIZGAME_SERVICE_PROVIDER_NAME) quizgameOptions: ClientOptions,
    private readonly csvParser: CsvParser
  ) {
    this.quizgameClient = ClientProxyFactory.create(quizgameOptions);
  }
  async createQuestions(eventId: string, file: Express.Multer.File) {
    const bufferStream = Readable.from(file.buffer.toString());
    const data: ParsedData<QAData> = await this.csvParser.parse(bufferStream, QAData);
    const formattedData = [];

    if (data && data.list) {
      data.list.forEach((item) => {
        item.options = JSON.parse(item.options);
        item.answer = JSON.parse(item.answer);
      });
      data.list.map((item) => {
        formattedData.push({
          question: item.question,
          options: item.options,
          answer: Number(item.answer),
        });
      });
    }

    return this.quizgameClient.send(
      { method: "POST", path: "/quiz-game/questions" },
      {
        eventId,
        data: formattedData,
      }
    );
  }

  async getQuestionsInRoomGame(roomId: string) {
    try {
      const data = this.quizgameClient.send({ method: "GET", path: "/quiz-game/questions/:roomId" }, { roomId }).pipe(
        catchError((error) => {
          const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.message || "An error occurred";
          throw new HttpException(message, statusCode);
        })
      );
      return lastValueFrom(data);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
