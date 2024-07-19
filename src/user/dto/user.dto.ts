import {
  IsString,
  Min,
  Max,
  Length,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsString()
  @Length(5, 50)
  email: string;

  @IsNumber()
  @Min(0)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(180)
  long: number;

  @IsString()
  @IsOptional()
  @Length(3, 20)
  city: string;
}
