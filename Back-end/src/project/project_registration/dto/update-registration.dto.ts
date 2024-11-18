import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ClassRegistrationStatus } from 'src/enums/class-registration-status.enum';
import { TeamRole } from 'src/enums/team-role.enum';

export class UpdateProjectRegistrationDto {

    @IsOptional()
    @IsEnum(ClassRegistrationStatus)
    registration_status?: ClassRegistrationStatus;

    @IsOptional()
    @IsString()
    project_role?: string;
    
    @IsOptional()
    @IsEnum(TeamRole)
    team_role?: TeamRole;
}