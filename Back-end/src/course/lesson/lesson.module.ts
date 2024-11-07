import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity'
import { CoursesModule } from '../courses/courses.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Lesson]),
        CoursesModule
    ],
    controllers: [LessonController],
    providers: [LessonService],
})
export class LessonModule {}