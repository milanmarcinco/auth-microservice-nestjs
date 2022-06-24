import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from "argon2";

import { PrismaService } from "src/prisma/prisma.service";

import { SignUpDto } from "./dto";

@Injectable()
export class AuthService {
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;

  ACCESS_TOKEN_EXP: string;
  REFRESH_TOKEN_EXP: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
    this.ACCESS_TOKEN_SECRET = this.config.get("ACCESS_TOKEN_SECRET");
    this.REFRESH_TOKEN_SECRET = this.config.get("REFRESH_TOKEN_SECRET");

    this.ACCESS_TOKEN_EXP = this.config.get("ACCESS_TOKEN_EXP");
    this.REFRESH_TOKEN_EXP = this.config.get("REFRESH_TOKEN_EXP");
  }

  async signUp(dto: SignUpDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash: await argon.hash(dto.password),
        },
        select: { id: true },
      });

      const accessToken = this.genAccessToken(user.id);
      const refreshToken = this.genRefreshToken(user.id);

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshTokens: {
            push: refreshToken,
          },
        },
      });

      return {
        ...user,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new HttpException("Credentials are already taken", HttpStatus.BAD_REQUEST);
        }
      }

      throw err;
    }
  }

  genAccessToken(userId: string) {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: this.ACCESS_TOKEN_SECRET,
        expiresIn: this.ACCESS_TOKEN_EXP,
      }
    );
  }

  genRefreshToken(userId: string) {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: this.REFRESH_TOKEN_SECRET,
        expiresIn: this.REFRESH_TOKEN_EXP,
      }
    );
  }
}
