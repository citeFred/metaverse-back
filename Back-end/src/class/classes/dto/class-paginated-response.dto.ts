import { ClassResponseDto } from "./class-response.dto";

export class ClassPaginatedResponseDto {
    classes: ClassResponseDto[];
    totalCount: number;

    constructor(classes: ClassResponseDto[], totalCount: number) {
        this.classes = classes;
        this.totalCount = totalCount;
    }
}