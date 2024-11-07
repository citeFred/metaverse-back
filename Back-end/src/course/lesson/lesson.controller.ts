import { Controller, Post, Get, Patch, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';

@Controller('courses/:courseId/lessons')
export class LessonController {
    constructor(private readonly lessonService: LessonService) {}

    @Post('register')
    async createLesson(
        @Param('courseId') courseId: number,
        @Body() createLessonDto: CreateLessonDto
    ): Promise<{ message: string; data: Lesson }> {
        const data = await this.lessonService.createLesson(courseId, createLessonDto);
        return { message: "Lesson 생성에 성공하셨습니다", data };
    }

    @Get()
    async findAllLessons(
        @Param('courseId') courseId: number
    ): Promise<{ message: string; data: Lesson[] }> {
        const data = await this.lessonService.findAllLessons(courseId);
        return { message: "전체 Lesson 조회에 성공하셨습니다", data };
    }

    @Get(':lessonId/detail')
    async findOne(
        @Param('courseId') courseId: number,
        @Param('lessonId') lessonId: number
    ): Promise<{ message: string; data: Lesson }> {
        const data = await this.lessonService.findOneLesson(courseId, lessonId);
        if (!data) {
            throw new NotFoundException('Lesson not found');
        }
        return { message: "특정 Lesson 조회에 성공하셨습니다", data };
    }

    @Patch(':lessonId/update')
    async updateLesson(
        @Param('courseId') courseId: number,
        @Param('lessonId') lessonId: number,
        @Body() updateLessonDto: UpdateLessonDto
    ): Promise<{ message: string; data: Lesson }> {
        const data = await this.lessonService.updateLesson(courseId, lessonId, updateLessonDto);
        return { message: "Lesson 정보 업데이트에 성공하셨습니다", data };
    }

    @Delete(':lessonId/delete')
    async removeLesson(
        @Param('courseId') courseId: number,
        @Param('lessonId') lessonId: number
    ): Promise<{ message: string; data: Lesson }> {
        const data = await this.lessonService.removeLesson(courseId, lessonId);
        if (!data) {
            throw new NotFoundException('Lesson not found');
        }
        return { message: "Lesson 삭제에 성공하셨습니다", data };
    }
}