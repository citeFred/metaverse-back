import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    user_name: string;

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    passwordConfirm: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    
    @IsString()
    @IsNotEmpty()
    nick_name: string;

    @IsEnum(UserRole) // enum 검증 추가
    user_role: UserRole;

    // DTO 내에서 추가 검증 로직 작성
    validatePasswords() {
        if (this.password !== this.passwordConfirm) {
            throw new Error('Passwords do not match');
        }
    }
}