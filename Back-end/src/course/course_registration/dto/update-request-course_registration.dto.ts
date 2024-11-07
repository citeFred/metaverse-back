import { IsOptional, IsEnum } from 'class-validator';
import { CourseRegistrationStatus } from 'src/enums/course-registration-status.enum';

export class UpdateRequestCourseRegistrationDto {

    @IsOptional()
    @IsEnum(CourseRegistrationStatus)
    course_registration_status?: CourseRegistrationStatus;
}