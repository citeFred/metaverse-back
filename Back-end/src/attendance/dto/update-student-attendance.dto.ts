import { IsEnum, IsNumber } from 'class-validator';

export class UpdateStudentAttendanceDto {
    @IsNumber()
    classId: number;

    @IsNumber()
    studentId: number;

    @IsEnum(['present', 'absent', 'late'])
    newField: 'present' | 'absent' | 'late';
}