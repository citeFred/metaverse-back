import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { Role } from 'src/enums/role.enum';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 핸들러 또는 클래스에 설정된 역할을 가져오기
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 설정된 역할이 없는(==권한설정을 하지 않은) 핸들러는 기본적으로 true를 반환해 접근을 허용
        if (!requiredRoles) {
            return true;
        }

        // 요청 객체에서 사용자 정보를 가져오기
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        console.log('User from request:', user);
        console.log('Required roles:', requiredRoles);
        
        // 사용자의 역할이 필요한 역할 목록에 포함되는지 권한 확인
        return requiredRoles.some((role) => user.user_role === role);
    }

    // // 사용자 역할을 확인하는 메소드
    // async getUserRole(userId: number): Promise<Role> {
    //     const user = await this.userService.findOne(userId);
    //     return user.user_role; // 역할 반환
    // }
  
    // private getRequiredRoles(context: ExecutionContext): string[] {
    //     const handler = context.getHandler();
    //     return Reflect.getMetadata('roles', handler) || [];
    // }
}
