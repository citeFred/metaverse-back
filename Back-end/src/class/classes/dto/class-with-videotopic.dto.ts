import { Class } from '../entities/class.entity';
import { DocNameResponseDto } from 'src/class/doc_name/dto/doc-name-with-classdoc-response.dto';

export class ClassWithVideoTopicResponseDto {
    title: string;
    description: string;
    instructor: string;
    generation: number;
    docName: DocNameResponseDto[];

    constructor(classEntity: Class) {
        this.title = classEntity.title;
        this.description = classEntity.description;
        this.instructor = classEntity.instructor;
        this.generation = classEntity.generation;
        this.docName = classEntity.docName 
            ? classEntity.docName.map(docName => new DocNameResponseDto(docName)) 
            : [];
    }
}