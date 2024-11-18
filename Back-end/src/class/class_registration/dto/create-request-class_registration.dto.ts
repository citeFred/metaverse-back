// CreateRequestClassRegistrationDto.ts
import { IsNotEmpty, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ClassRegistrationStatus } from 'src/enums/class-registration-status.enum';

export class CreateRequestClassRegistrationDto {

    @IsNotEmpty()
    @IsEnum(ClassRegistrationStatus)
    @Transform(({ value }) => value || ClassRegistrationStatus.PENDING) // 기본값을 PENDING으로 설정
    class_registration_status: ClassRegistrationStatus;

    @IsNotEmpty() // 필수 필드로 설정
    class_reporting_date: string; // ISO 형식의 날짜 문자열
}