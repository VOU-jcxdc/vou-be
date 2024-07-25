import { Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";

@Injectable()
export class UserService {
  private client: ClientProxy;

  constructor(@Inject("USER_SERVICE") private readonly options: ClientOptions) {
    this.client = ClientProxyFactory.create(options);
  }

  async getUser(id: string) {
    return "User";
  }
}
