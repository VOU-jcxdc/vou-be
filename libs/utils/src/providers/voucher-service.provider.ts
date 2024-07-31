import { ConfigService } from "@nestjs/config";
import { VOUCHER_SERVICE_PROVIDER_NAME, IServiceProvider } from "@types";
import { ClientOptions, Transport } from "@nestjs/microservices";

export const voucherServiceProvider: IServiceProvider = {
  provide: VOUCHER_SERVICE_PROVIDER_NAME,
  useFactory: (configService: ConfigService): ClientOptions => ({
    transport: Transport.TCP,
    options: {
      host: configService.get("VOUCHER_SERVICE_HOST"),
      port: configService.get("VOUCHER_SERVICE_PORT"),
    },
  }),
  inject: [ConfigService],
};
