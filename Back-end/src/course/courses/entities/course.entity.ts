import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { DocName } from '../../doc_name/entities/doc_name.entity';
import { Lesson } from 'src/course/lesson/entities/lesson.entity';
import { User } from 'src/user/user.entity';
import { CourseRegistration } from 'src/course/course_registration/entities/course_registration.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class Course extends BaseEntity {
    @Column({ type: 'varchar', unique: true })
    title: string;

    @Column({ type: 'varchar' })
    description: string;
    
    @Column({ type: 'varchar' })
    instructor: string;

    @Column({ type: 'int', nullable: false, default: 3})
    generation: number;

    @ManyToMany(() => User, (user) => user.course)
    user: User[];

    @OneToMany(() => DocName, (docname) => docname.course, { cascade: true })
    docName: DocName[];

    @OneToMany(() => Lesson, lesson => lesson.course)
    lessons: Lesson[];

    // course - course_registration
    @OneToMany(() => CourseRegistration, (course_registration) => course_registration.course, { cascade: true })
    course_registrations: CourseRegistration[];

    @OneToMany(() => Attendance, attendance => attendance.course)
    attendances: Attendance[];
}