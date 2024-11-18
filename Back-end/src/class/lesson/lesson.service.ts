import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Class } from '../classes/entities/class.entity';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>,
        @InjectRepository(Class)
        private readonly classRepository: Repository<Class>,
    ) {}

    async createLesson(
        classId: number, 
        createLessonDto: CreateLessonDto
    ): Promise<Lesson> {
        const foundClass = await this.classRepository.findOne({ 
            where: { id: classId }
        });
        if (!foundClass) {
            throw new NotFoundException("해당 코스를 찾을 수 없습니다.");
        }
        const createdLesson = this.lessonRepository.create({
            ...createLessonDto
        });
        const savedLesson = await this.lessonRepository.save(createdLesson);
        return savedLesson
    }

    async findAllLessons(
        classId:  number
    ): Promise<Lesson[]> {
        const lessons = await this.lessonRepository.find({
            where: { class: { id: classId } } // classTitle을 사용하여 필터링
        });
        if (!lessons.length) {
            throw new NotFoundException("해당 코스의 강의가 없습니다.");
        }
        return lessons;
    }

    async findOneLesson(
        classId: number, 
        lessonId: number
    ): Promise<Lesson> {
        const foundLesson = await this.lessonRepository.findOne({
            where: { 
                class: { id: classId }, 
                lesson_id: lessonId
            }
        });
        if (!foundLesson) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        return foundLesson;
    }

    async updateLesson(
        classId: number, 
        lessonId: number, 
        updateLessonDto: UpdateLessonDto
    ): Promise<Lesson> {
        const foundLesson = await this.findOneLesson(classId, lessonId);
        if (!foundLesson) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        Object.assign(foundLesson, updateLessonDto);
        const updatedLesson = await this.lessonRepository.save(foundLesson);
        return updatedLesson;
    }

    async removeLesson(
        classId: number, 
        lessonId: number
    ): Promise<Lesson> {
        const foundLesson = await this.findOneLesson(classId, lessonId);
        if (!foundLesson) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const removedLesson = await this.lessonRepository.remove(foundLesson);
        return removedLesson;
    }
}