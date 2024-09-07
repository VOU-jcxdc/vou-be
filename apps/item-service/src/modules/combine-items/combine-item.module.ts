import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CombineItemController } from "./combine-item.controller";
import { CombineItemService } from "./combine-item.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CombineItemModelModule } from "../model/combine_item-model.module";
import { AccountItemRepositoryModule } from "../repository/account-item-repository.module";

@Module({
  imports: [
    CombineItemModelModule,
    AccountItemRepositoryModule,
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: "RMQ_VOUCHER_SERVICE",
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>("RMQ_URLS")],
            queue: configService.get<string>("RMQ_QUEUE"),
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CombineItemController],
  providers: [CombineItemService],
})
export class CombineItemModule {}
