import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    lesson_id: number;

    @Column({ type: 'varchar', length: 20 })
    lesson_title: string;

    @Column({ type: 'varchar', length: 100 })
    lesson_file_path: string;

    @ManyToOne(() => Course, course => course.lessons, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: Course;
}