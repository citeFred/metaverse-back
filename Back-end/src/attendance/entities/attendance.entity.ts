import { Class } from 'src/class/classes/entities/class.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('attendance')
export class Attendance {
    @PrimaryGeneratedColumn()
    attendance_id: number;

    @ManyToOne(() => Class, classEntity => classEntity.attendances)
    class: Class;

    @ManyToOne(() => User, user => user.attendances)
    user: User;
    
    @Column()
    attendance_date: Date;

    @Column({
        type: 'enum',
        enum: ['present', 'absent', 'late'],
        default: 'absent',
    })
    field: 'present' | 'absent' | 'late';

    @Column()
    random_code: string; // 난수 저장
}