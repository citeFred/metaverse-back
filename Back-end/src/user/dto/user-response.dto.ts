import { UserRole } from '../../enums/user-role.enum';
import { User } from '../user.entity';

export class UserResponseDto {
    user_name: string;
    id: string;
    email: string;
    user_role: UserRole;

    constructor(user: User) {
        this.user_name = user.user_name;
        this.id = user.id;
        this.email = user.email;
        this.user_role = user.user_role;
    }
}