import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';
import { User } from '../user/user.entity';
import { Class } from '../class/classes/entities/class.entity';
import { ClassRegistration } from '../class/class_registration/entities/class_registration.entity';
import { ClassRegistrationStatus } from 'src/enums/class-registration-status.enum';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        @InjectRepository(ClassRegistration)
        private classRegistrationRepository: Repository<ClassRegistration>,
    ) {}

    // 출석 기록 생성
    async createAttendance(classId: number, userId: number, field: 'present' | 'absent' | 'late', randomCode: string): Promise<Attendance> {
        const user = await this.userRepository.findOne({ where: { user_id: userId } });
        const foundClass = await this.classRepository.findOne({ where: { id: classId } });
        
        // 사용자 또는 수업이 존재하지 않으면 예외 처리
        if (!user || !foundClass) {
            throw new NotFoundException('User or Class not found');
        }

        // 출석 기록 생성
        const attendance = this.attendanceRepository.create({
            class: foundClass,
            user,
            attendance_date: new Date(),
            field,
            random_code: randomCode,
        });

        // 출석 기록 저장
        return this.attendanceRepository.save(attendance);
    }

    async findAttendance(classId: number, userId: number): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOne({
            where: { class: { id: classId }, user: { user_id: userId } },
        });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        return attendance;
    }

    async updateAttendanceStatus(attendanceId: number, newField: 'present' | 'absent' | 'late'): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOne({ where: { attendance_id: attendanceId } });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        attendance.field = newField; // 새로운 출석 상태로 변경
        return this.attendanceRepository.save(attendance);
    }

    async checkAttendance(classId: number, userId: number, inputCode: string): Promise<boolean> {
        const attendance = await this.findAttendance(classId, userId);

        // 입력한 난수와 저장된 난수 비교
        if (attendance.random_code === inputCode) {
            await this.updateAttendanceStatus(attendance.attendance_id, 'present'); // 출석 상태 변경
            return true; // 출석 성공
        } else {
            return false; // 출석 실패
        }
    }
    // 특정 학생의 출석 상태 업데이트
    async updateAttendanceByStudentId(dto: UpdateStudentAttendanceDto): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOne({
            where: { class: { id: dto.classId }, user: { user_id: dto.studentId } },
        });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found for the specified student.');
        }

        attendance.field = dto.newField; // 새로운 출석 상태로 변경
        return this.attendanceRepository.save(attendance);
    }

    async getUsersInClass(classId: number): Promise<User[]> {
        const registrations = await this.classRegistrationRepository.find({
            where: { 
                class: { id: classId }, 
                class_registration_status: ClassRegistrationStatus.APPROVED // 'approved' 상태의 학생만 가져오기
            },
            relations: ['user'], // 사용자 정보를 가져옵니다.
        });
    
        return registrations.map(registration => registration.user); // 등록된 사용자 목록 반환
    }

    async createAttendanceForApprovedStudents(classId: number, randomCode: string): Promise<Attendance[]> {
        // 승인된 학생 조회
        const approvedRegistrations = await this.classRegistrationRepository
            .createQueryBuilder('registration')
            .leftJoinAndSelect('registration.user', 'user') // 사용자와 조인
            .where('registration.class_id = :classId', { classId })
            .andWhere('registration.class_registration_status = :status', { status: ClassRegistrationStatus.APPROVED })
            .getMany(); // 여러 개의 결과 가져오기
    
        // 출석 기록 생성 및 저장
        const attendances: Attendance[] = [];
        for (const registration of approvedRegistrations) {
            const attendance = this.attendanceRepository.create({
                class: { id: classId }, // class_id로 Class 엔티티 참조
                user: registration.user, // 사용자 엔티티 참조
                attendance_date: new Date(),
                field: 'absent', // 기본값: 'absent'
                random_code: randomCode, // 생성된 난수 저장
            });
            attendances.push(await this.attendanceRepository.save(attendance));
        }
    
        return attendances; // 생성된 출석 기록 반환
    }
}