import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity'
import { ClassesModule } from '../classes/classes.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Lesson]),
        ClassesModule
    ],
    controllers: [LessonController],
    providers: [LessonService],
})
export class LessonModule {}