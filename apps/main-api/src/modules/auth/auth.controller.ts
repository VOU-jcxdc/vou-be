import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAccountDto } from "@types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  async signup(@Body() data: CreateAccountDto) {
    return this.authService.signup(data);
  }

  @Post("sign-in")
  async login(@Body() data: { phone: string; password: string }) {
    return this.authService.login(data.phone, data.password);
  }

  @Get("otp")
  async sendOTP(@Query("phone") phone: string) {
    return this.authService.sendOTP(phone);
  }

  @Post("otp")
  async verifyOTP(@Body() data: { phone: string; otp: string }) {
    return this.authService.verifyOTP(data.phone, data.otp);
  }
}
