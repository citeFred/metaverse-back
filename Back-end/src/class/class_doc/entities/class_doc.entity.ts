import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DocName } from '../../doc_name/entities/doc_name.entity';

@Entity()
export class ClassDoc {
    @PrimaryGeneratedColumn()
    class_document_id: number;

    @CreateDateColumn({ nullable: true })
    upload_date: Date; 
    
    @Column({ type: 'varchar', length: 100 })
    file_path: string;

    @ManyToOne(() => DocName, (docname) => docname.classDocs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doc_name_id' })
    docName: DocName;
}