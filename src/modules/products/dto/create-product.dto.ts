import { IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly price: string;

  @IsString()
  readonly category: string;

  @IsString()
  readonly imageFileName: string;
}
