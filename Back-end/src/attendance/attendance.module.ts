import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { User } from '../user//user.entity';
import { Class } from '../class/classes/entities/class.entity';
import { ClassRegistration } from 'src/class/class_registration/entities/class_registration.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Attendance, User, Class, ClassRegistration]),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [AttendanceService],
})
export class AttendanceModule {}