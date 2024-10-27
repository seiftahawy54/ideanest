import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsString()
  @Length(5, 50)
  email: string;

  @IsString()
  @Length(5, 50)
  password: string;
}
