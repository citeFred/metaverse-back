import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseRegistrationStatus } from 'src/enums/course-registration-status.enum';
import { TeamRole } from 'src/enums/team-role.enum';

export class UpdateProjectRegistrationDto {

    @IsOptional()
    @IsEnum(CourseRegistrationStatus)
    registration_status?: CourseRegistrationStatus;

    @IsOptional()
    @IsString()
    project_role?: string;
    
    @IsOptional()
    @IsEnum(TeamRole)
    team_role?: TeamRole;
}