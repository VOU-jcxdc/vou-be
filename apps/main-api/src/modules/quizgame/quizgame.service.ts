import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { IQAs, QUIZGAME_SERVICE_PROVIDER_NAME } from "@types";
import { catchError, lastValueFrom, of } from "rxjs";
import { Readable } from "stream";
import { parse } from "csv-parse";
@Injectable()
export class QuizgameService {
  private quizgameClient: ClientProxy;
  private readonly logger = new Logger(QuizgameService.name);

  constructor(@Inject(QUIZGAME_SERVICE_PROVIDER_NAME) quizgameOptions: ClientOptions) {
    this.quizgameClient = ClientProxyFactory.create(quizgameOptions);
  }
  async createQuestions(eventId: string, file: Express.Multer.File) {
    try {
      const bufferStream = Readable.from(file.buffer.toString());
      const formattedData: IQAs[] = [];

      return new Promise((resolve, reject) => {
        bufferStream
          .pipe(parse({ delimiter: "," }))
          .on("data", (row) => {
            const data =
              row.length === 1
                ? row[0].split(/[,;]/).filter((item: string) => item !== "") // Export CSV with Excel
                : row.filter((item: string) => item !== ""); // Standard CSV file (Google Sheets)
            formattedData.push({
              question: data[0],
              options: data.slice(1, data.length - 1),
              answer: data[data.length - 1],
              eventId,
            });
          })
          .on("end", async () => {
            if (formattedData.length > 0) {
              const data = this.quizgameClient
                .send({ method: "POST", path: "/quiz-game/questions" }, { data: formattedData, eventId })
                .pipe(
                  catchError((error) => {
                    const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                    const message = error.message || "An error occurred";
                    reject(new HttpException(message, statusCode));
                    return of({ message: message });
                  })
                );
              const result = await lastValueFrom(data);
              resolve(result);
            } else {
              reject(new BadRequestException("No data found"));
            }
          })
          .on("error", (error) => {
            this.logger.error(error);
            reject(new BadRequestException(error));
            bufferStream.destroy();
            return;
          });
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
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

  async createRoomGame(eventId: string) {
    try {
      const data = this.quizgameClient.send({ method: "POST", path: "/quiz-game/room-game" }, { eventId }).pipe(
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
