import { Course } from '../entities/course.entity';
import { DocNameResponseDto } from 'src/course/doc_name/dto/doc-name-with-coursedoc-response.dto';

export class CourseWithDocNameAndCourseDocResponseDto {
    title: string;
    description: string;
    instructor: string;
    generation: number;
    docName: DocNameResponseDto[];

    constructor(course: Course) {
        this.title = course.title;
        this.description = course.description;
        this.instructor = course.instructor;
        this.generation = course.generation;
        this.docName = course.docName 
            ? course.docName.map(docName => new DocNameResponseDto(docName)) 
            : [];
    }
}