import { ConfigService } from "@nestjs/config";
import { QUIZGAME_SERVICE_PROVIDER_NAME, IServiceProvider } from "@types";
import { ClientOptions, Transport } from "@nestjs/microservices";

export const quizgameServiceProvider: IServiceProvider = {
  provide: QUIZGAME_SERVICE_PROVIDER_NAME,
  useFactory: (configService: ConfigService): ClientOptions => ({
    transport: Transport.TCP,
    options: {
      host: configService.get("QUIZGAME_SERVICE_HOST"),
      port: configService.get("QUIZGAME_SERVICE_PORT_LB"),
    },
  }),
  inject: [ConfigService],
};
