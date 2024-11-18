import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Class } from '../../classes/entities/class.entity';
import { ClassDoc } from '../../class_doc/entities/class_doc.entity';

@Entity()
export class DocName {
    @PrimaryGeneratedColumn()
    topic_id: number;

    @Column({ type: 'varchar', length: 20 })
    topic_title: string;

    @Column({ nullable: true })
    pa_topic_id: number;
    
    @ManyToOne(() => DocName, docName => docName.subTopics, { nullable: true })
    @JoinColumn({ name: 'pa_topic_id' })
    pa_topic: DocName;

    @OneToMany(() => DocName, docName => docName.pa_topic, { cascade: ['remove'] })
    subTopics: DocName[];

    @ManyToOne(() => Class, classEntity => classEntity.docName, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'class_id' })
    class: Class;

    @OneToMany(() => ClassDoc, classDoc => classDoc.docName, { cascade: true })
    classDocs: ClassDoc[];
}