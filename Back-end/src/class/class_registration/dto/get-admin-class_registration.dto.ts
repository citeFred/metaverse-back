import { ClassRegistration } from '../entities/class_registration.entity';
import { UserResponseDto } from '../../../user/dto/user-response.dto';
import { ClassResponseDto } from '../../classes/dto/class-response.dto';
import { ClassRegistrationStatus } from 'src/enums/class-registration-status.enum';

export class GetAdminResponseClassRegistrationDto {
    class_registration_status: ClassRegistrationStatus;
    class_reporting_date: Date;
    applicant: UserResponseDto;
    currentClass: ClassResponseDto;

    constructor(registration: ClassRegistration) {
        this.class_registration_status = registration.class_registration_status; // 강의 신청 상태
        this.class_reporting_date = registration.class_reporting_date; // 강의 신청 날짜
        this.applicant = new UserResponseDto(registration.user); // 사용자 정보
        this.currentClass = new ClassResponseDto(registration.class); // 강의 정보
    }
}