import { Injectable, NotFoundException, Logger, HttpException, HttpStatus, BadRequestException, ConflictException } from '@nestjs/common';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassRegistration } from '../class_registration/entities/class_registration.entity';
import { ClassRegistrationStatus } from 'src/enums/class-registration-status.enum';
import { ClassPaginatedResponseDto } from './dto/class-paginated-response.dto';
import { ClassResponseDto } from './dto/class-response.dto';

@Injectable()
export class ClassesService {
    private readonly logger = new Logger(ClassesService.name);

    constructor(
        @InjectRepository(Class)
        private classesRepository: Repository<Class>,
        @InjectRepository(ClassRegistration)
        private readonly classRegistrationRepository: Repository<ClassRegistration>,
    ) {}

    async create(createClassDto: CreateClassDto): Promise<Class> {
        const existClass = await this.classesRepository.findOne({
            where: { title: createClassDto.title },
        });

        if (existClass) {
            throw new HttpException('강의 제목이 이미 존재합니다.', HttpStatus.BAD_REQUEST);
        }
  
        const createdClass = this.classesRepository.create(createClassDto);
        await this.classesRepository.save(createdClass);
        this.logger.log(`강의가 생성되었습니다: ${createdClass.title}`);
        return createdClass;
    }

    async findAll(): Promise<Class[]> {
        return this.classesRepository.find();
    }

    // 페이징 추가 게시글 조회 기능
    async getPaginatedClasses(page: number, limit: number): Promise<ClassPaginatedResponseDto> {
        this.logger.verbose(`Retrieving paginated classs: page ${page}, limit ${limit}`);
        const skip: number = (page - 1) * limit;
    
        const [foundClasses, totalCount] = await this.classesRepository.createQueryBuilder("class")
            // .leftJoinAndSelect("class.author", "user")
            .skip(skip)
            .take(limit)
            .orderBy("class.createdAt", "DESC") // 내림차순
            .getManyAndCount();
    
        const classDtos = foundClasses.map(foundClass => new ClassResponseDto(foundClass));
        this.logger.verbose(`Paginated classs retrieved successfully`);
        return new ClassPaginatedResponseDto(classDtos, totalCount);
    }

    async findOne(classId: number): Promise<Class> {
        const foundClass = await this.classesRepository.findOne(
            { where: { id: classId },
            relations: ['docName','user'] 
        });
        if (!foundClass) {
            throw new NotFoundException('클래스를 찾지 못했습니다.'); // 예외 처리 추가
        }
        return foundClass;
    }

    async isApprovedInstructor(loginedUserId: number, classId: number): Promise<boolean> {
        const registration = await this.classRegistrationRepository.findOne({
            where: {
                user: { user_id: loginedUserId }, // 현재 로그인한 사용자 ID
                class: { id: classId }, // 현재 프로젝트 ID
                class_registration_status: ClassRegistrationStatus.APPROVED, // 승인된 상태 확인
            },
        });
        return !!registration;
    } 

    async update(classId: number, updateClassDto: UpdateClassDto, loginedUser: number): Promise<Class> {
        // 데이터베이스에서 해당 ID의 강의 조회
        const foundClass = await this.classesRepository.findOne(
            { where: { id: classId } 
        });

        if (!foundClass) {
            this.logger.warn(`클래스를 찾지 못했습니다.`);
            throw new NotFoundException(`클래스를 찾지 못했습니다.`);
        }

        // 해당 프로젝트에 대한 승인된 학생인지
        const approvedInstructor = await this.isApprovedInstructor(loginedUser, classId);

        if (!approvedInstructor) {
            throw new ConflictException(`수정 권한이 없습니다.`);
        }
  
        // UpdateClassDto에 포함된 필드만 업데이트
        if (updateClassDto.title) {
            foundClass.title = updateClassDto.title;
        }
        if (updateClassDto.description) {
            foundClass.description = updateClassDto.description;
        }
        if (updateClassDto.instructor) {
            foundClass.instructor = updateClassDto.instructor;
        }
  
        // 업데이트된 엔티티를 저장
        const savedClass = await this.classesRepository.save(foundClass);
        this.logger.log(`Class updated: ${savedClass.title}`);
        return savedClass;
    }
  
    async remove(classId: number): Promise<void> {
        const foundClass = await this.classesRepository.findOne(
            { where: { id: classId },
            relations: ['docName'] 
        });
        if (!foundClass) {
            throw new NotFoundException(`클래스를 찾지 못했습니다.`);
        }
    
        await this.classesRepository.remove(foundClass);
        this.logger.log(`클래스가 삭제되었습니다.`);
    }
}