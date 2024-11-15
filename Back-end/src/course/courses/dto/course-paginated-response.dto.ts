import { CourseResponseDto } from "./course-response.dto";

export class CoursePaginatedResponseDto {
    courses: CourseResponseDto[];
    totalCount: number;

    constructor(courses: CourseResponseDto[], totalCount: number) {
        this.courses = courses;
        this.totalCount = totalCount;
    }
}