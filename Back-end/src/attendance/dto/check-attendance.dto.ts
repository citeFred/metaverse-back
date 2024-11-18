import { IsNumber, IsString } from 'class-validator';

export class CheckAttendanceDto {
    @IsNumber()
    classId: number;

    @IsString()
    inputCode: string;
}