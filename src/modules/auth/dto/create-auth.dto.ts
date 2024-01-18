import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MinLength(1)
  name: string;

  @MinLength(1)
  @IsString()
  lastname: string;

  @MinLength(1)
  @IsString()
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  role_name?: string;
}
