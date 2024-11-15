import { Injectable, NotFoundException, Logger, HttpException, HttpStatus, BadRequestException, ConflictException } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRegistration } from '../course_registration/entities/course_registration.entity';
import { CourseRegistrationStatus } from 'src/enums/course-registration-status.enum';
import { CoursePaginatedResponseDto } from './dto/course-paginated-response.dto';
import { CourseResponseDto } from './dto/course-response.dto';

@Injectable()
export class CoursesService {
    private readonly logger = new Logger(CoursesService.name);

    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
        @InjectRepository(CourseRegistration)
        private readonly courseRegistrationRepository: Repository<CourseRegistration>,
    ) {}

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
        const existCourse = await this.coursesRepository.findOne({
            where: { title: createCourseDto.title },
        });

        if (existCourse) {
            throw new HttpException('강의 제목이 이미 존재합니다.', HttpStatus.BAD_REQUEST);
        }
  
        const course = this.coursesRepository.create(createCourseDto);
        await this.coursesRepository.save(course);
        this.logger.log(`강의가 생성되었습니다: ${course.title}`);
        return course;
    }

    async findAll(): Promise<Course[]> {
        return this.coursesRepository.find();
    }

    // 페이징 추가 게시글 조회 기능
    async getPaginatedCourses(page: number, limit: number): Promise<CoursePaginatedResponseDto> {
        this.logger.verbose(`Retrieving paginated courses: page ${page}, limit ${limit}`);
        const skip: number = (page - 1) * limit;
    
        const [foundCourses, totalCount] = await this.coursesRepository.createQueryBuilder("course")
            // .leftJoinAndSelect("course.author", "user")
            .skip(skip)
            .take(limit)
            .orderBy("course.createdAt", "DESC") // 내림차순
            .getManyAndCount();
    
        const courseDtos = foundCourses.map(foundCourse => new CourseResponseDto(foundCourse));
        this.logger.verbose(`Paginated courses retrieved successfully`);
        return new CoursePaginatedResponseDto(courseDtos, totalCount);
    }

    async findOne(courseId: number): Promise<Course> {
        const course = await this.coursesRepository.findOne(
            { where: { id: courseId },
            relations: ['docName','user'] 
        });
        if (!course) {
            throw new NotFoundException('클래스를 찾지 못했습니다.'); // 예외 처리 추가
        }
        return course;
    }

    async isApprovedInstructor(loginedUserId: number, courseId: number): Promise<boolean> {
        const registration = await this.courseRegistrationRepository.findOne({
            where: {
                user: { user_id: loginedUserId }, // 현재 로그인한 사용자 ID
                course: { id: courseId }, // 현재 프로젝트 ID
                course_registration_status: CourseRegistrationStatus.APPROVED, // 승인된 상태 확인
            },
        });
        return !!registration;
    } 

    async update(courseId: number, updateCourseDto: UpdateCourseDto, loginedUser: number): Promise<Course> {
        // 데이터베이스에서 해당 ID의 강의 조회
        const course = await this.coursesRepository.findOne(
            { where: { id: courseId } 
        });

        if (!course) {
            this.logger.warn(`클래스를 찾지 못했습니다.`);
            throw new NotFoundException(`클래스를 찾지 못했습니다.`);
        }

        // 해당 프로젝트에 대한 승인된 학생인지
        const approvedInstructor = await this.isApprovedInstructor(loginedUser, courseId);

        if (!approvedInstructor) {
            throw new ConflictException(`수정 권한이 없습니다.`);
        }
  
        // UpdateCourseDto에 포함된 필드만 업데이트
        if (updateCourseDto.title) {
            course.title = updateCourseDto.title;
        }
        if (updateCourseDto.description) {
            course.description = updateCourseDto.description;
        }
        if (updateCourseDto.instructor) {
            course.instructor = updateCourseDto.instructor;
        }
  
        // 업데이트된 엔티티를 저장
        await this.coursesRepository.save(course);
        this.logger.log(`Course updated: ${course.title}`);
        return course;
    }
  
    async remove(courseId: number): Promise<void> {
        const course = await this.coursesRepository.findOne(
            { where: { id: courseId },
            relations: ['docName'] 
        });
        if (!course) {
            throw new NotFoundException(`클래스를 찾지 못했습니다.`);
        }
    
        await this.coursesRepository.remove(course);
        this.logger.log(`클래스가 삭제되었습니다.`);
    }
}