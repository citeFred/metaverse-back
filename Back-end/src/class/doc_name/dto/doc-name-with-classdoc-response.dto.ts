import { ClassDocResponseDto } from "src/class/class_doc/dto/class_doc-response.dto";
import { DocName } from "../entities/doc_name.entity";

export class DocNameResponseDto {
    topic_id: number;
    topic_title: string;
    pa_topic_id: number;
    class_doc: ClassDocResponseDto[];
    
    constructor(docName: DocName) {
        this.topic_id = docName.topic_id;
        this.topic_title = docName.topic_title;
        this.pa_topic_id = docName.pa_topic_id;
        this.class_doc = docName.classDocs ? docName.classDocs.map(ClassDoc => new ClassDocResponseDto(ClassDoc)): [];
    }
}