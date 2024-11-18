import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestClassRegistrationDto } from './dto/create-request-class_registration.dto';
import { UpdateRequestClassRegistrationDto } from './dto/update-request-class_registration.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassRegistration } from './entities/class_registration.entity';
import { Class } from '../classes/entities/class.entity';
import { User } from '../../user/user.entity';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class ClassRegistrationService {
    constructor(
        @InjectRepository(ClassRegistration)
        private readonly classRegistrationRepository: Repository<ClassRegistration>,
        @InjectRepository(Class)
        private readonly classesRepository: Repository<Class>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    // 강의 ID가 유효한지 확인
    async validateClassId(classId: number): Promise<void> {
        const foundClass = await this.classesRepository.findOne({ where: { id: classId } });
        if (!foundClass) {
            throw new NotFoundException(`Class with ID ${classId} not found`);
        }
    }

    // 해당 강의에 이미 수강신청이 되어 있는지 확인
    async isEnrolled(classId: number, userId: number): Promise<boolean> {
        const existingEnrollment = await this.classRegistrationRepository.findOne({
            where: {
                class: { id: classId }, // 프로젝트 ID로 필터링
                user: { user_id: userId }, // 사용자 ID로 필터링
            },
        });

        return !!existingEnrollment; // 이미 존재하면 true, 없으면 false
    }

    // 수강 신청 하기
    async create(createClassRegistrationDto: CreateRequestClassRegistrationDto, classId: number, loginedUser: number) {
        await this.validateClassId(classId);
        // 이미 해당 강의에 참가 신청이 되어 있을 때
        const isAlreadyEnrolled = await this.isEnrolled(classId, loginedUser);

        if(isAlreadyEnrolled){
            throw new ConflictException('신청된 강의입니다.');
        }

        // 처음 참가 신청
        const classRegistration = this.classRegistrationRepository.create(createClassRegistrationDto);
        classRegistration.user = await this.userRepository.findOneBy({ user_id: loginedUser });  // 특정 사용자와 연결된 정보
        classRegistration.class = await this.classesRepository.findOneBy({ id: classId });  // 특정 프로젝트와 연결된 정보
        if (!classRegistration.user || !classRegistration.class) {
            throw new NotFoundException('사용자 또는 강의를 찾을 수 없습니다.');
        }
        return await this.classRegistrationRepository.save(classRegistration);
    }

    // <admin> 전체 수강 신청 정보 조회
    async findAllClassesWithRegistrationsForAdmin(class_id: number): Promise<ClassRegistration[]> {
        await this.validateClassId(class_id)
        const registrations = await this.classRegistrationRepository.find({
            relations: ['user', 'class'], // 사용자와 강의 정보 모두 로드
            where: { class: { generation: 3 } },
        });
    
        if (registrations.length === 0) {
            throw new NotFoundException(`수강 신청 정보가 없습니다.`);
        }
    
        return registrations;
    }

    // <student,instructor> 개인 수강 신청 상태 조회
    async findOne(id: number, classId: number):Promise<ClassRegistration> {
        await this.validateClassId(classId);
        const classRegistration = await this.classRegistrationRepository.findOne({ where: { class_registration_id: id }});
        if(!classRegistration) {
            throw new NotFoundException(`Registration with ID ${id} not found`);
        }
        return classRegistration;
    }

    // 수강 신청 수정
    async update(id: number, updateRequestClassRegistrationDto: UpdateRequestClassRegistrationDto, classId: number) {
        const classRegistration = await this.findOne(id, classId);

        Object.assign(classRegistration, updateRequestClassRegistrationDto);
        return await this.classRegistrationRepository.save(classRegistration);
    }

    // 수강 신청 제거
    async remove(id: number, classId: number): Promise<void> {
        await this.findOne(id, classId);
        await this.classRegistrationRepository.delete(id);
    }
}