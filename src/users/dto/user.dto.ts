import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';

const RolesArray = ['ADMIN', 'USER'];

class AddressDto {
  @IsString()
  @IsNotEmpty()
  readonly city: string;
  @IsString()
  @IsNotEmpty()
  readonly country: string;
  @IsString()
  @IsNotEmpty()
  readonly street: string;
}

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
  readonly address: AddressDto;
}