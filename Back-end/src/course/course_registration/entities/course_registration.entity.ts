import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Course } from "src/course/courses/entities/course.entity";
import { User } from "src/user/user.entity";
import { CourseRegistrationStatus } from "src/enums/course-registration-status.enum";

@Entity()
export class CourseRegistration {
    @PrimaryGeneratedColumn()
    course_registration_id: number;

    @Column({
        type: 'enum',
        enum: CourseRegistrationStatus,
        default: CourseRegistrationStatus.PENDING,
    })
    course_registration_status: CourseRegistrationStatus;

    @Column({ type: 'timestamp', nullable: false })
    course_reporting_date: Date;

    // course_registration - user
    @ManyToOne(() => User, (user) => user.course_registrations)
    @JoinColumn({ name: 'userId' }) // 외래 키의 이름을 명시
    user: User;

    // course_registration - course
    @ManyToOne(() => Course, (course) => course.course_registrations)
    @JoinColumn({ name: 'courseId' }) // 외래 키의 이름을 명시
    course: Course;
}
