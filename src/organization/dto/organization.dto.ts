import { IsOptional, IsString, Length } from 'class-validator';

export class OrganizationDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsString()
  @Length(5, 255)
  description: string;

  @IsString()
  @Length(5, 255)
  createdBy: string;
}
