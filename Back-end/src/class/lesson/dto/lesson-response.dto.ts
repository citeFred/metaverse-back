import { Lesson } from "../entities/lesson.entity";

export class LessonResponseDto {
    lesson_id: number;
    lesson_title: string;
    lesson_file_path: string

    constructor(lesson: Lesson) {
        this.lesson_id = lesson.lesson_id;
        this.lesson_title = lesson.lesson_title;
        this.lesson_file_path = lesson.lesson_file_path;
    }
}