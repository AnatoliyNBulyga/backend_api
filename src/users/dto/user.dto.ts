import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';

const RolesArray = ['ADMIN', 'USER'];

export class UserDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly firstname: string;
  @IsString()
  @IsNotEmpty()
  readonly lastname: string;
  @IsOptional()
  readonly profile: any;
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(RolesArray)
  readonly role: string;
}