import { IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { CourseRegistrationStatus } from 'src/enums/course-registration-status.enum';

export class CreateProjectRegistrationDto {

    @IsNotEmpty()
    @IsDateString()
    reporting_date: string;

    @IsNotEmpty()
    @IsEnum(CourseRegistrationStatus)
    registration_status: CourseRegistrationStatus;
}