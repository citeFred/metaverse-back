// CreateRequestCourseRegistrationDto.ts
import { IsNotEmpty, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { CourseRegistrationStatus } from 'src/enums/course-registration-status.enum';

export class CreateRequestCourseRegistrationDto {

    @IsNotEmpty()
    @IsEnum(CourseRegistrationStatus)
    @Transform(({ value }) => value || CourseRegistrationStatus.PENDING) // 기본값을 PENDING으로 설정
    course_registration_status: CourseRegistrationStatus;

    @IsNotEmpty() // 필수 필드로 설정
    course_reporting_date: string; // ISO 형식의 날짜 문자열
}
