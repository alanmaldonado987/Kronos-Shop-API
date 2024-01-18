import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginAuthDto {
  @MinLength(1)
  @IsString()
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}
