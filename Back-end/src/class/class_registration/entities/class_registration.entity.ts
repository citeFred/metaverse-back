import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Class } from "src/class/classes/entities/class.entity";
import { User } from "src/user/user.entity";
import { ClassRegistrationStatus } from "src/enums/class-registration-status.enum";

@Entity()
export class ClassRegistration {
    @PrimaryGeneratedColumn()
    class_registration_id: number;

    @Column({
        type: 'enum',
        enum: ClassRegistrationStatus,
        default: ClassRegistrationStatus.PENDING,
    })
    class_registration_status: ClassRegistrationStatus;

    @Column({ type: 'timestamp', nullable: false })
    class_reporting_date: Date;

    // class_registration - user
    @ManyToOne(() => User, (user) => user.class_registrations)
    @JoinColumn({ name: 'userId' }) // 외래 키의 이름을 명시
    user: User;

    // class_registration - class
    @ManyToOne(() => Class, (classEntity) => classEntity.class_registrations)
    @JoinColumn({ name: 'classId' }) // 외래 키의 이름을 명시
    class: Class;
}