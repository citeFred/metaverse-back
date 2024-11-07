import { PartialType } from '@nestjs/mapped-types';
import { IsString, Length } from 'class-validator'
import { CreateLessonDto } from './create-lesson.dto';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
    @IsString()
    @Length(0, 20)
    lesson_title: string;
}