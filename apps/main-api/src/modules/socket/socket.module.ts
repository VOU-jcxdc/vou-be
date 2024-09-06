import { Module } from "@nestjs/common";
import { QuizGameGateway } from "./quiz-game.gateway";
import { RabbitmqModule, RedisModule } from "@shared-modules";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

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
    RabbitmqModule,
  ],
  providers: [QuizGameGateway],
  exports: [QuizGameGateway],
})
export class SocketModule {}
