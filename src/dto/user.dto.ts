import { IsString, IsEmail } from "class-validator";

export class UserDTO{
    @IsEmail()
    email : string

    @IsString()
    password : string

    @IsString()
    nickname : string
}