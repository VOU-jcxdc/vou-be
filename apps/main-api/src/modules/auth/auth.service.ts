import { Inject, Injectable } from "@nestjs/common";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { CreateAccountDto } from "@types";

@Injectable()
export class AuthService {
  private _client: ClientProxy;
  constructor(@Inject("USER_SERVICE") private readonly options: ClientOptions) {
    this._client = ClientProxyFactory.create(options);
  }

  async signup(data: CreateAccountDto) {
    return this._client.send({ cmd: "create_new_account" }, data).pipe();
  }

  async login(phone: string, password: string) {
    return this._client.send({ cmd: "verify_account" }, { phone, password }).pipe();
  }
}
