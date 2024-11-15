import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    title?: string;  

    @IsString()
    @IsOptional()
    description?: string; 

    @IsString()
    @IsOptional()
    instructor?: string; 

    @IsOptional()
    generation?: number;
}