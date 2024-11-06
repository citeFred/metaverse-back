import { Role } from '../../enums/role.enum';
import { User } from '../user.entity';

export class UserResponseDto {
    user_name: string;
    email: string;
    user_role: Role;

    constructor(user: User) {
        this.user_name = user.user_name;
        this.email = user.email;
        this.user_role = user.user_role;
    }
}
