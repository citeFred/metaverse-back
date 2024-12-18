import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { ClassesService } from 'src/class/classes/classes.service';

@Injectable()
export class ApprovedInstructorGuard implements CanActivate {
  constructor(private readonly classesService: ClassesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const loginedUserId = request.user.user_id; // 로그인된 사용자 ID
    const classId = +request.params.id; // 강의 ID

    // 사용자가 해당 강의에 대해 승인된 강사인지 확인
    const isApproved = await this.classesService.isApprovedInstructor(loginedUserId, classId);

    if (!isApproved) {
      throw new ForbiddenException('해당 강의에 대한 권한이 없습니다.');
    }

    return true;
  }
}