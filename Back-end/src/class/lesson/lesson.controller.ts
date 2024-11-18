import { Controller, Post, Get, Patch, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';

@Controller('classes/:classId/lessons')
export class LessonController {
    constructor(private readonly lessonService: LessonService) {}

    @Post('register')
    async createLesson(
        @Param('classId') classId: number,
        @Body() createLessonDto: CreateLessonDto
    ): Promise<{ message: string; data: Lesson }> {
        const data = await this.lessonService.createLesson(classId, createLessonDto);
        return { message: "Lesson 생성에 성공하셨습니다", data };
    }

    @Get()
    async findAllLessons(
        @Param('classId') classId: number
    ): Promise<{ message: string; data: Lesson[] }> {
        const data = await this.lessonService.findAllLessons(classId);
        return { message: "전체 Lesson 조회에 성공하셨습니다", data };
    }

    @Get(':lessonId/detail')
    async findOne(
        @Param('classId') classId: number,
        @Param('lessonId') lessonId: number
    ): Promise<{ message: string; data: Lesson }> {
        const data = await this.lessonService.findOneLesson(classId, lessonId);
        if (!data) {
            throw new NotFoundException('Lesson not found');
        }
        return { message: "특정 Lesson 조회에 성공하셨습니다", data };
    }

    @Patch(':lessonId/update')
    async updateLesson(
        @Param('classId') classId: number,
        @Param('lessonId') lessonId: number,
        @Body() updateLessonDto: UpdateLessonDto
    ): Promise<{ message: string; data: Lesson }> {
        const data = await this.lessonService.updateLesson(classId, lessonId, updateLessonDto);
        return { message: "Lesson 정보 업데이트에 성공하셨습니다", data };
    }

    @Delete(':lessonId/delete')
    async removeLesson(
        @Param('classId') classId: number,
        @Param('lessonId') lessonId: number
    ): Promise<{ message: string; data: Lesson }> {
        const data = await this.lessonService.removeLesson(classId, lessonId);
        if (!data) {
            throw new NotFoundException('Lesson not found');
        }
        return { message: "Lesson 삭제에 성공하셨습니다", data };
    }
}