import { IsNumber } from 'class-validator';

export class CreateAttendanceDto {
    @IsNumber()
    classId: number;
}