import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../user/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { CourseRegistrationStatus } from 'src/enums/course-registration-status.enum';
import { TeamRole } from 'src/enums/team-role.enum';

@Entity()
export class ProjectRegistration {
    @PrimaryGeneratedColumn()
    project_registration_id: number;

    @Column({ type: 'timestamp', nullable: false })
    reporting_date: Date;

    @Column({
        type: 'enum',
        enum: CourseRegistrationStatus,
        default: CourseRegistrationStatus.PENDING,
    })
    registration_status: CourseRegistrationStatus;

    @Column({ type: 'varchar', length: 50, nullable: true })
    project_role: string;

    @Column({
        type: 'enum',
        enum: TeamRole,
        default: TeamRole.MEMBER,
    })
    team_role: TeamRole;

    // project_registration - user
    @ManyToOne(() => User, (user) => user.project_registrations)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // project_registration - project
    @ManyToOne(() => Project, (project) => project.project_registrations)
    @JoinColumn({ name: 'project_id' })
    project: Project;
}