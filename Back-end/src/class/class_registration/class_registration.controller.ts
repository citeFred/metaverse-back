import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClassRegistrationService } from './class_registration.service';
import { CreateRequestClassRegistrationDto } from './dto/create-request-class_registration.dto';
import { UpdateRequestClassRegistrationDto } from './dto/update-request-class_registration.dto';
import { GetAdminResponseClassRegistrationDto } from './dto/get-admin-class_registration.dto';
import { ClassRegistration } from './entities/class_registration.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('classes/:classId/classRegistration')
export class ClassRegistrationController {
    constructor(private readonly classRegistrationService: ClassRegistrationService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('register')
    @Roles('instructor', 'student','admin')
    // 수강 신청
    async create(
        @Body() createRequestClassRegistrationDto: CreateRequestClassRegistrationDto,
        @Param('id') classId: number,
        @Request() req
    ): Promise<{ message: string }> {
        // 로그인된 user 저장
        const loginedUser = req.user.user_id;

        // 수강 신청 생성
        await this.classRegistrationService.create(createRequestClassRegistrationDto, classId, loginedUser);

        return { 
            message: "수강 신청이 완료되었습니다."
        };
    }

    // <admin> 전체 수강 신청 정보 조회
    @Get()
    @Roles('admin')
    async findAllForAdmin(
        @Param('id') classId: number,
    ): Promise<{ message: string, data: GetAdminResponseClassRegistrationDto[] }> {
        const foundRegistrations = await this.classRegistrationService.findAllClassesWithRegistrationsForAdmin(classId);
        const responseDtos = foundRegistrations.map(responseDto => new GetAdminResponseClassRegistrationDto(responseDto));

        return {
            message: "수강 신청 정보가 조회되었습니다.",
            data: responseDtos,
        };
    }

    // <student,instructor> 개인 수강 신청 상태 조회
    @Get(':id')
    @Roles('student','instructor')
    async findOne(
        @Param('id') id: number,
        @Param('classId') classId: number
    ): Promise<{ message: string, data: ClassRegistration }> {
        const generation = '3기';
        const data = await this.classRegistrationService.findOne(id, classId);

        return {
            message: "수강 신청 정보가 조회되었습니다.",
            data: data
        };
    }

    // 수강 신청 수정
    @Patch(':id/update')
    @Roles('admin')
    async update(
        @Param('id') id: number, 
        @Body() updateRequestClassRegistrationDto: UpdateRequestClassRegistrationDto,
        @Param('classId') classId: number
    ) {
        const data = this.classRegistrationService.update(id, updateRequestClassRegistrationDto, classId);
        return {
            message: "수강 신청이 정보가 업데이트되었습니다.",
            data: data,
        }
    }

    // 수강 신청 삭제
    @Delete(':id/delete')
    @Roles('instructor', 'student')
    remove(
        @Param('id') id: number,
        @Param('classId') classId: number
    ) {
        const data = this.classRegistrationService.remove(id, classId);
        return {
            message: "수강 신청이 취소되었습니다.",
            data: data,
        }
    }
}