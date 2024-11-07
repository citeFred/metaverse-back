import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { User } from '../user//user.entity';
import { Course } from '../course/courses/entities/course.entity';
import { CourseRegistration } from 'src/course/course_registration/entities/course_registration.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Attendance, User, Course, CourseRegistration]),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [AttendanceService],
})
export class AttendanceModule {}