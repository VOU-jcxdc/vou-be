import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { RedisClientType } from "@redis/client";
import { REDIS_PROVIDER } from "@types";
import { RedisClientOptions, createClient } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType | null = null;

  constructor(@Inject(REDIS_PROVIDER) private readonly options: RedisClientOptions) {}

  async onModuleInit() {
    if (!this.client) {
      this.client = createClient(this.options) as unknown as RedisClientType;
      await this.client.connect();
      console.log("Redis connected");
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.disconnect();
    }
  }
}
