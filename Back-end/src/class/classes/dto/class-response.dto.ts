import { Class } from '../entities/class.entity';

export class ClassResponseDto {
    id: number;
    title: string;
    instructor: string;
    description: string;
    generation: number;

    constructor(classEntity: Class) {
        this.id = classEntity.id;
        this.title = classEntity.title;
        this.instructor = classEntity.instructor;
        this.description = classEntity.description;
        this.generation = classEntity.generation;
    }
}