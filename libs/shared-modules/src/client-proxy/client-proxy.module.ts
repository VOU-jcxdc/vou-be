import { Module, Provider } from "@nestjs/common";
import * as serviceProviders from "@utils/providers";

const providers = (Object.keys(serviceProviders) as Array<keyof typeof serviceProviders>).map(
  (key) => serviceProviders[key] as Provider
);

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class ClientProxyModule {}
