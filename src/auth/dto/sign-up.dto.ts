import { Transform } from "class-transformer";
import { IsString, IsEmail, MaxLength, MinLength, IsDefined } from "class-validator";

export class SignUpDto {
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @MaxLength(50, { message: "Email is too long" })
  @IsEmail({}, { message: "Email is invalid" })
  @IsString({ message: "Email must be a string" })
  @IsDefined({ message: "Please provide an email" })
  email: string;

  @MaxLength(50, { message: "Password is too long" })
  @MinLength(8, { message: "Password is too short" })
  @IsString({ message: "Password must be a string" })
  @IsDefined({ message: "Please provide a password" })
  password: string;
}
