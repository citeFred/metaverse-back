import { ClassDoc } from "../entities/class_doc.entity";

export class ClassDocResponseDto {
    upload_date: Date;
    file_path: string;

    constructor(classDoc: ClassDoc) {
        this.upload_date = classDoc.upload_date;
        this.file_path = classDoc.file_path;
    }
}