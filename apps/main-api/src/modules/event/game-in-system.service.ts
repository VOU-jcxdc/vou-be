import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { EVENT_SERVICE_PROVIDER_NAME, UpdateGameInSystemDto } from "@types";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class GameInSystemService {
  private eventClient: ClientProxy;
  constructor(@Inject(EVENT_SERVICE_PROVIDER_NAME) eventOptions: ClientOptions) {
    this.eventClient = ClientProxyFactory.create(eventOptions);
  }

  async getAllGamesInSystem() {
    const rawData = this.eventClient.send({ method: "GET", path: "/games-in-system" }, {}).pipe(
      catchError((error) => {
        console.log("error", error);
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";
        throw new HttpException(message, statusCode);
      })
    );

    return lastValueFrom(rawData);
  }

  async updateGameInSystem(id: string, gameInSystemData: UpdateGameInSystemDto) {
    const rawData = this.eventClient
      .send(
        { method: "PUT", path: `/games-in-system/:id` },
        {
          id,
          gameInSystemData,
        }
      )
      .pipe(
        catchError((error) => {
          const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.message || "An error occurred";
          throw new HttpException(message, statusCode);
        })
      );

    return lastValueFrom(rawData);
  }
}
