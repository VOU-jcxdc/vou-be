import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientOptions, ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { CreateAccountDto, ILoginResponse } from "@types";
import { catchError, lastValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  private _client: ClientProxy;
  constructor(@Inject("USER_SERVICE") options: ClientOptions, private readonly jwtService: JwtService) {
    this._client = ClientProxyFactory.create(options);
  }

  async signup(data: CreateAccountDto) {
    const pattern = { method: "POST", path: "/account/create-account" };
    return this._client.send(pattern, data).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";

        throw new HttpException(message, statusCode);
      })
    );
  }

  async login(phone: string, password: string) {
    const loginResponse: ILoginResponse = { access_token: "" };
    const pattern = { method: "POST", path: "/account/verify-account" };
    const res = await this._client.send(pattern, { phone, password }).pipe(
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || "An error occurred";

        throw new HttpException(message, statusCode);
      })
    );

    const data = await lastValueFrom(res);
    loginResponse.access_token = this.jwtService.sign({
      userId: data.id,
      role: data.role,
    });
    return loginResponse;
  }
}
