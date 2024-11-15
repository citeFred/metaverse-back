import { Course } from '../entities/course.entity';

export class CourseResponseDto {
    id: number;
    title: string;
    instructor: string;
    description: string;
    generation: number;

    constructor(course: Course) {
        this.id = course.id;
        this.title = course.title;
        this.instructor = course.instructor;
        this.description = course.description;
        this.generation = course.generation;
    }
}