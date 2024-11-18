import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateClassDto {
   @IsString()
   @IsNotEmpty()
   title: string;
  
   @IsString()
   @IsNotEmpty()
   description: string;
  
   @IsString()
   @IsNotEmpty()
   instructor: string;

   @IsNotEmpty()
   generation: number;
}