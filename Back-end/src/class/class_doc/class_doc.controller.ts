import { Controller, Get, Post, Body, NotFoundException, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClassDocService } from './class_doc.service';
import { CreateClassDocDto } from './dto/create-class_doc.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('classes/:classId/docNames/:topicId/classDocs')
export class ClassDocController {
    constructor(private readonly classDocService: ClassDocService) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Param('classId') classId: number,
        @Param('topicId') topicId: number,
        @Body() createClassDocDto: CreateClassDocDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        const data = await this.classDocService.uploadFile(classId, topicId, createClassDocDto, file);
        return {
            message: "File을 성공적으로 업로드 하셨습니다.",
            data: data,
        };
    }

    @Get()
    async findAll(
        @Param('classId') classId: number,
        @Param('topicId') topicId: number,
    ) {
        const data = await this.classDocService.findAll(classId, topicId);
        return {
            message: "Class Documents 조회에 성공하셨습니다.",
            data: data,
        };
    }

    @Get('download/:fileUrl')
    async downloadFile(
        @Param('fileUrl') fileUrl: string, 
        @Res() res: Response
    ) {
        try {
            const { stream, metadata } = await this.classDocService.downloadFile(fileUrl);

            res.set({
                'Content-Type': metadata.ContentType || 'application/octet-stream',
                'Content-Disposition': `attachment; fileurl="${fileUrl}"`,
                'Content-Length': metadata.ContentLength,
            });

        // res.end(fileBuffer);
        stream.pipe(res);
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            throw new NotFoundException('파일 다운로드에 실패했습니다.');
        }
    }
  
    @Delete(':id')
    async remove(
        @Param('classId') classId: number,
        @Param('topicId') topicId: number,
        @Param('id') id: number
    ) {
        await this.classDocService.remove(classId, topicId, id);
        return {
            message: "Class Document가 성공적으로 삭제되었습니다.",
        };
    }
}