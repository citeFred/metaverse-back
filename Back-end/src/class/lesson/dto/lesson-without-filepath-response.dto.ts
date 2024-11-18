import { Lesson } from "../entities/lesson.entity";

export class LessonWithoutFilePathResponseDto {
    lesson_id: number;
    lesson_title: string;

    constructor(lesson: Lesson) {
        this.lesson_id = lesson.lesson_id;
        this.lesson_title = lesson.lesson_title;
    }
}