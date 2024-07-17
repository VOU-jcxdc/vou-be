import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REDIS_PROVIDER } from "@types";

import { RedisClientOptions } from "redis";
import { RedisService } from "./redis.service";

@Module({
  providers: [
    {
      provide: REDIS_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisClientOptions => ({
        socket: {
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
        },
      }),
    },
    RedisService,
  ],
})
export class RedisModule {}
