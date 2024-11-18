import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';

@Controller('classes/:classId/docNames')
export class DocNameController {
    constructor(private readonly docNameService: DocNameService) {}

    @Post('registerDN')
    async create(
        @Param('classId') classId: number, 
        @Body() createDocNameDto: CreateDocNameDto
    ) {
        const data = await this.docNameService.create(classId, createDocNameDto);
        return {
            message: "doc_name 생성에 성공하셨습니다",
            data: data
        };
    }

    @Get('allDN')
    async findAll(
        @Param('classId') classId: number, 
    ) {
        const data = await this.docNameService.findAll(classId);
        return {
            message: "전체 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get('root')
    async findRootDocName(
        @Param('classId') classId: number, 
    ) {
        const data = await this.docNameService.findRootDocName(classId);
        return {
            message: "특정 강의의 pa_topic_id의 값을 null로 갖는 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get(':topicId/read')
    async findOne(
        @Param('classId') classId: number, 
        @Param('topicId') topicId: number
    ) {
        const data = await this.docNameService.findOne(classId, topicId);
        return {
            message: "특정 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':topicId/update')
    async update(
        @Param('classId') classId: number, 
        @Param('topicId') topicId: number,
        @Body() updateDocNameDto: UpdateDocNameDto
    ) {
        const data = await this.docNameService.update(classId, topicId, updateDocNameDto);
        return {
          message: "doc_name 수정에 성공하셨습니다",
          data: data
        };
    }
  

    @Delete(':topicId/delete')
    async remove(
        @Param('classId') classId: number, 
        @Param('topicId') topicId: number
    ) {
        const data = await this.docNameService.remove(classId, topicId);
        return {
            message: "doc_name 삭제에 성공하셨습니다",
            data: data
        };
    }
}