import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../../enums/role.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    user_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    passwordConfirm: string;

    @IsEnum(Role) // enum 검증 추가
    user_role: Role;

    // DTO 내에서 추가 검증 로직 작성
    validatePasswords() {
        if (this.password !== this.passwordConfirm) {
            throw new Error('Passwords do not match');
        }
    }
}
