import { Controller, Post, Body, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckAttendanceDto } from './dto/check-attendance.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    //난수 발생
    @Post('generate-code/:classId')
    async generateAttendanceCode(
        @Param('classId') classId: number,
    ): Promise<{ randomCode: string }> {
        const randomCode = AttendanceController.generateRandomCode(); // 하나의 난수 생성

        // 모든 approved인 학생에 대한 출석 기록 생성
        await this.attendanceService.createAttendanceForApprovedStudents(classId, randomCode); 

        return { randomCode }; // 생성된 난수 반환
    }

    @Post('check')
    async checkAttendance(
        @Body() body: CheckAttendanceDto,
        @Req() request
    ): Promise<boolean> {
        const userId = request.user.id; // 학생의 ID
        return this.attendanceService.checkAttendance(body.classId, userId, body.inputCode);
    }

    // 강사가 특정 학생의 출석 상태를 임의로 변경하는 메서드
    @Patch('update-status/student')
    async updateStudentAttendanceStatus(
        @Body() body: UpdateStudentAttendanceDto,
        @Req() request
    ): Promise<Attendance> {
        // 권한 확인 로직을 추가할 수 있습니다.
        return this.attendanceService.updateAttendanceByStudentId(body);
    }

     // 난수 생성 함수
     private static generateRandomCode(): string {
        return Math.floor(1000 + Math.random() * 9000).toString(); // 4자리 난수 생성
    }
}