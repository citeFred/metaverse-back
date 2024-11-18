
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ProjectRegistration } from '../project/project_registration/entities/registration.entity';
import { Project } from '../project/projects/entities/project.entity';
import { UserRole } from '../enums/user-role.enum';
import { Exhibition } from '../exhibition/exhibitions/entities/exhibition.entity';
import { Class } from 'src/class/classes/entities/class.entity';
import { ClassRegistration } from 'src/class/class_registration/entities/class_registration.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: 'varchar', length: 18 })
    user_name: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        nullable: false,
    })

    user_role: UserRole; // Role 타입으로 변경

    @ManyToMany(() => Class, classEntity => classEntity.user)
    @JoinTable()
    class: Class[];

    @OneToMany(() => Exhibition, exhibition => exhibition.user,{ cascade: true })
    exhibition: Exhibition[];

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    nick_name: string;
    
    // user - project 연결 추가
    @ManyToMany(() => Project, (project) => project.users)
    @JoinTable() 
    projects: Project[];

    // user - project_registration 연결 추가
    @OneToMany(() => ProjectRegistration, (project_registration) => project_registration.user)
    project_registrations: ProjectRegistration[];

    // user - class_registration  연결 추가
    @OneToMany(() => ClassRegistration, (class_registration) => class_registration.user)
    class_registrations: ClassRegistration[];

    // 학생이 출석 기록을 가질 수 있는 관계 설정
    @OneToMany(() => Attendance, attendance => attendance.user)
    attendances: Attendance[];
}