import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RabbitMqService } from "./rabbit-mq.service";
import { RMQ_PROVIDER } from "@types";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RMQ_PROVIDER,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get("RMQ_URLS")],
            queue: configService.get("RMQ_QUEUE"),
            queueOptions: {
              durable: false,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    RabbitMqService,
  ],
  exports: [RabbitMqService],
})
export class RabbitmqModule {}
