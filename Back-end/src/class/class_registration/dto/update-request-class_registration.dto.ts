import { IsOptional, IsEnum } from 'class-validator';
import { ClassRegistrationStatus } from 'src/enums/class-registration-status.enum';

export class UpdateRequestClassRegistrationDto {

    @IsOptional()
    @IsEnum(ClassRegistrationStatus)
    class_registration_status?: ClassRegistrationStatus;
}