import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { DocName } from '../../doc_name/entities/doc_name.entity';
import { Lesson } from 'src/class/lesson/entities/lesson.entity';
import { User } from 'src/user/user.entity';
import { ClassRegistration } from 'src/class/class_registration/entities/class_registration.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class Class extends BaseEntity {
    @Column({ type: 'varchar', unique: true })
    title: string;

    @Column({ type: 'varchar' })
    description: string;
    
    @Column({ type: 'varchar' })
    instructor: string;

    @Column({ type: 'int', nullable: false, default: 3})
    generation: number;

    @ManyToMany(() => User, (user) => user.class)
    user: User[];

    @OneToMany(() => DocName, (docname) => docname.class, { cascade: true })
    docName: DocName[];

    @OneToMany(() => Lesson, lesson => lesson.class)
    lessons: Lesson[];

    // class - class_registration
    @OneToMany(() => ClassRegistration, (class_registration) => class_registration.class, { cascade: true })
    class_registrations: ClassRegistration[];

    @OneToMany(() => Attendance, attendance => attendance.class)
    attendances: Attendance[];
}