import { IsNotEmpty, MaxLength } from "class-validator";

export class LogInRequestDto {

    @IsNotEmpty()
    @MaxLength(100)
    email: string;
    
    @IsNotEmpty()
    @MaxLength(20)
    password: string;

}