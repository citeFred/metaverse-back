import { IsNumber, IsString } from 'class-validator';

export class CheckAttendanceDto {
    @IsNumber()
    courseId: number;

    @IsString()
    inputCode: string;
}