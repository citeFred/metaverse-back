import { IsString, IsOptional, Length, IsNumber } from 'class-validator'

export class CreateLessonDto {
    @IsString()
    @Length(0, 20)
    lesson_title: string;
}