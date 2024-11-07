import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async createLesson(
        courseId: number, 
        createLessonDto: CreateLessonDto
    ): Promise<Lesson> {
        const course = await this.courseRepository.findOne({ 
            where: { course_id: courseId }
        });
        if (!course) {
            throw new NotFoundException("해당 코스를 찾을 수 없습니다.");
        }
        const lesson = this.lessonRepository.create({
            ...createLessonDto
        });
        return await this.lessonRepository.save(lesson);
    }

    async findAllLessons(
        courseId:  number
    ): Promise<Lesson[]> {
        const lessons = await this.lessonRepository.find({
            where: { course: { course_id: courseId } } // courseTitle을 사용하여 필터링
        });
        if (!lessons.length) {
            throw new NotFoundException("해당 코스의 강의가 없습니다.");
        }
        return lessons;
    }

    async findOneLesson(
        courseId: number, 
        lessonId: number
    ): Promise<Lesson> {
        const lesson = await this.lessonRepository.findOne({
            where: { 
                course: { course_id: courseId }, 
                lesson_id: lessonId
            }
        });
        if (!lesson) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        return lesson;
    }

    async updateLesson(
        courseId: number, 
        lessonId: number, 
        updateLessonDto: UpdateLessonDto
    ): Promise<Lesson> {
        const lesson = await this.findOneLesson(courseId, lessonId);
        if (!lesson) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        Object.assign(lesson, updateLessonDto);
        return await this.lessonRepository.save(lesson);
    }

    async removeLesson(
        courseId: number, 
        lessonId: number
    ): Promise<Lesson> {
        const lesson = await this.findOneLesson(courseId, lessonId);
        if (!lesson) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        await this.lessonRepository.remove(lesson);
        return lesson;
    }
}
