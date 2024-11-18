import { IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { ClassRegistrationStatus } from 'src/enums/class-registration-status.enum';

export class CreateProjectRegistrationDto {

    @IsNotEmpty()
    @IsDateString()
    reporting_date: string;

    @IsNotEmpty()
    @IsEnum(ClassRegistrationStatus)
    registration_status: ClassRegistrationStatus;
}