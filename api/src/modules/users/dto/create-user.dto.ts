import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsEnum, IsOptional } from "class-validator";
import { RoleName } from '../../../../generated/prisma/enums';
import type { RoleName as RoleNameType } from '../../../../generated/prisma/enums';

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsString()
    password!: string;

    @ApiProperty({ enum: ["USER", "SELLER", "ADMIN"], required: false })
    @IsOptional()
    @IsEnum(RoleName)
    role?: RoleNameType;
}
