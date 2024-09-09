import { Module } from "@nestjs/common";
import { QuizGameGateway } from "./quiz-game.gateway";
import { RabbitmqModule, RedisModule } from "@shared-modules";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { QuizgameModule } from "../quizgame/quizgame.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: "QUIZGAME_SERVICE",
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>("RMQ_URLS")],
            queue: "roomGameStatus_queue",
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: "QUIZGAME_VOUCHER_SERVICE",
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>("RMQ_URLS")],
            queue: "main_queue",
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),

    RabbitmqModule,
    QuizgameModule,
  ],
  providers: [QuizGameGateway],
  exports: [QuizGameGateway],
})
export class SocketModule {}
