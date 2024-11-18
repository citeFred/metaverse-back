import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from '../../classes/entities/class.entity';

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    lesson_id: number;

    @Column({ type: 'varchar', length: 20 })
    lesson_title: string;

    @Column({ type: 'varchar', length: 100 })
    lesson_file_path: string;

    @ManyToOne(() => Class, classEntity => classEntity.lessons, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'class_id' })
    class: Class;
}