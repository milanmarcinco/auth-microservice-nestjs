import { NestFactory } from "@nestjs/core";
import { BadRequestException, ValidationPipe } from "@nestjs/common";

import { ValidationError } from "class-validator";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      validationError: {
        target: false,
        value: false,
      },
      stopAtFirstError: true,

      exceptionFactory: (errors: ValidationError[] = []) => {
        return new BadRequestException({
          error: Object.values(errors[0].constraints)[0],
        });
      },
    })
  );

  await app.listen(3000);
}

bootstrap();
