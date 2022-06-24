import { Controller, Body, Post, Patch, Delete } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { SignUpDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  async signUp(@Body() signUpDto: SignUpDto) {
    return {
      ...(await this.authService.signUp(signUpDto)),
    };
  }

  @Post("sign-in")
  signIn() {}

  @Post("renew-token")
  renewAccessToken() {}

  @Patch("change-password")
  changePassword() {}

  @Delete("log-out")
  logOut() {}

  @Delete("log-out-everywhere")
  logOutEverywhere() {}

  @Delete("delete-profile")
  deleteProfile() {}
}
