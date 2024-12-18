import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ClassesService } from '../class/classes/classes.service'; // 코스 서비스 임포트
import { ProjectsService } from '../project/projects/projects.service'; // 프로젝트 서비스 임포트
import { ClassDocService } from '../class/class_doc/class_doc.service';
import { DocNameService } from '../class/doc_name/doc_name.service';
import { ProjectDocService } from 'src/project/project_doc/project_doc.service';
import { FeedbackService } from 'src/project/feedback/feedback.service';


@Injectable()
export class OwnershipGuard extends JwtAuthGuard implements CanActivate {
    constructor(
        private readonly clasesService: ClassesService,
        private readonly projectService: ProjectsService,
        private readonly classDocService: ClassDocService,
        private readonly docNameService: DocNameService,
        private readonly projectDocService: ProjectDocService,
        private readonly feedbackService: FeedbackService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('사용자가 인증되지 않았습니다.');
        }

        // 관리자 여부 확인
        if (user.user_role === 'admin') {
            return true;
        }

        const resourceType = request.params.type; // 리소스 유형 가져오기
        const resourceId = request.params.id; // 리소스 ID 가져오기

        if (!resourceType || !resourceId) {
            throw new ForbiddenException('리소스 종류와 ID가 필요합니다.');
        }

        let resourceOwnerId: number | null = null;
        if (resourceType === 'class') {
            const foundClass = await this.clasesService.findOne(resourceId);
            if (!foundClass) {
                throw new ForbiddenException('존재하지 않는 코스입니다.');
            }

            const owner = foundClass.user.find(user => user.user_id === user.user_id);
            if (!owner) {
                throw new ForbiddenException('자신의 리소스만 수정할 수 있습니다.');
            }
        
            resourceOwnerId = owner.user_id; 
        }
        
        else if (resourceType === 'project') {
            const project = await this.projectService.findOne(resourceId);
            if (!project) {
                throw new ForbiddenException('존재하지 않는 프로젝트입니다.');
            }
            // 프로젝트와 관련된 사용자 중 요청한 사용자 ID와 일치하는 사용자 찾기
            const owner = project.users.find(user => user.user_id === user.user_id);
            if (!owner) {
                throw new ForbiddenException('자신의 리소스만 수정할 수 있습니다.');
            }
            resourceOwnerId = owner.user_id; 
        }

        else if (resourceType === 'project') {
            const project = await this.projectService.findOne(resourceId);
            if (!project) {
                throw new ForbiddenException('존재하지 않는 프로젝트입니다.');
            }
            // 프로젝트와 관련된 사용자 중 요청한 사용자 ID와 일치하는 사용자 찾기
            const owner = project.users.find(user => user.user_id === user.user_id);
            if (!owner) {
                throw new ForbiddenException('자신의 리소스만 수정할 수 있습니다.');
            }
            resourceOwnerId = owner.user_id; 
        }

        else if (resourceType === 'projectDoc') {
            const projectDoc = await this.projectDocService.findById(resourceId);
            if (!projectDoc) {
                throw new ForbiddenException('존재하지 않는 프로젝트 문서 입니다.');
            }
            // 프로젝트와 관련된 사용자 중 요청한 사용자 ID와 일치하는 사용자 찾기
            const owner = projectDoc.project.users.find(user => user.user_id === user.user_id);
            if (!owner) {
                throw new ForbiddenException('자신의 리소스만 수정할 수 있습니다.');
            }
            resourceOwnerId = owner.user_id; 
        }

        else if (resourceType === 'feedback') {
            const feedback = await this.feedbackService.findById(resourceId);
            if (!feedback) {
                throw new ForbiddenException('존재하지 않는 프로젝트 문서 입니다.');
            }
            // 프로젝트와 관련된 사용자 중 요청한 사용자 ID와 일치하는 사용자 찾기
            const owner = feedback.projectDoc.project.users.find(user => user.user_id === user.user_id);
            if (!owner) {
                throw new ForbiddenException('자신의 리소스만 수정할 수 있습니다.');
            }
            resourceOwnerId = owner.user_id; 
        }

        else if ( resourceType ==='classDoc'){
            const classDoc = await this.classDocService.findById(resourceId);
            if (!classDoc){
                throw new ForbiddenException('존재하지 않는 전시회입니다.');
            }

            const owner = classDoc.docName.class.user.find(user => user.user_id === user.user_id)
            if (!owner) {
                throw new ForbiddenException('자신의 리소스만 수정할 수 있습니다.');
            }
            resourceOwnerId = owner.user_id; 
        }

        else if ( resourceType ==='docName'){
            const docName = await this.docNameService.findById(resourceId);
            if (!docName){
                throw new ForbiddenException('존재하지 않는 전시회입니다.');
            }

            const owner = docName.class.user.find(user => user.user_id === user.user_id)
            if (!owner) {
                throw new ForbiddenException('자신의 리소스만 수정할 수 있습니다.');
            }
            resourceOwnerId = owner.user_id; 
        }
        
        else {
            throw new ForbiddenException('지원하지 않는 리소스 유형입니다.');
        }
        
        // 소유권 확인
        if (resourceOwnerId !== user.user_id) {
            throw new ForbiddenException('자신의 리소스만 삭제할 수 있습니다.');
        }

        return true;
    }
}