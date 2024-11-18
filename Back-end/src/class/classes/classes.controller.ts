import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, Query, Logger } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { OwnershipGuard } from '../../auth/ownership.guard';
import { ApiResponse } from 'src/common/api-response.dto';
import { ClassPaginatedResponseDto } from './dto/class-paginated-response.dto';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('api/classes')
export class ClassesController {
    private readonly logger = new Logger(ClassesController.name);

    constructor(private readonly classesService: ClassesService) {}

    @Post('register')
    @Roles('admin')
    async create(
      @Body() CreateClassDto: any,
    ) {
        const data = await this.classesService.create(CreateClassDto);
        return {
            message: "생성에 성공하셨습니다",
            data: data
        };
    }

    @Get()
    @Roles('student','instructor','admin')
    async findAll() {
        const data = await this.classesService.findAll();
        return {
            message: "전체 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    // 페이징 처리된 코스 목록 조회
    @Get('paginated')
    @Roles('student','instructor','admin')
    async getPaginatedClasses(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<ApiResponse<ClassPaginatedResponseDto>> {
        this.logger.verbose(`Retrieving paginated classes: page ${page}, limit ${limit}`);
        const paginatedClasses = await this.classesService.getPaginatedClasses(page, limit);
        this.logger.verbose(`Paginated classes retrieved successfully`);
        return new ApiResponse(true, 200, 'Paginated articles retrieved successfully', paginatedClasses);
    }

    @Get(':id/read')
    @Roles('student','instructor','admin')
    async findOne(
      @Param('id') id: number
    ) {
        const data = await this.classesService.findOne(id);
        return {
            message: "특정 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':type/:id/update')
    @Roles('admin','instructor')
    @UseGuards(OwnershipGuard)
    async update(
      @Param('id') id: number, 
      @Body() updateClassDto: any,
      @Request() req
    ) {
        const loginedUser = req.user.user_id;
        const data = await this.classesService.update(id, updateClassDto, loginedUser);
        return {
            message: "강의 수정에 성공하셨습니다",
            data: data
        };
    }

    @Delete(':type/:id/delete')
    @UseGuards(OwnershipGuard)
    @Roles('admin')
    async remove(
      @Param('id') id: number
    ) {
        const data = await this.classesService.remove(id);
        return {
            message: "강의 삭제에 성공하셨습니다",
            data: data
        };
    }
}
