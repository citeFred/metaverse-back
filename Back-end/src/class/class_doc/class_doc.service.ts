import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassDoc } from './entities/class_doc.entity';
import { DocName } from '../doc_name/entities/doc_name.entity';
import { Class } from '../classes/entities/class.entity'
import { CreateClassDocDto } from './dto/create-class_doc.dto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class ClassDocService {
    private s3: S3Client;

    constructor(
        @InjectRepository(ClassDoc)
        private readonly classDocRepository: Repository<ClassDoc>,
        @InjectRepository(DocName)
        private readonly docNameRepository: Repository<DocName>,
        @InjectRepository(Class)
        private readonly classesRepository: Repository<Class>,
        private readonly configService: ConfigService 
    ) {
        const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
        const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
        const AWS_REGION = process.env.AWS_REGION;
        const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

        if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_S3_BUCKET_NAME) {
            throw new BadRequestException('AWS 관련 환경 변수가 설정되지 않았습니다. 모든 변수를 확인해주세요.');
        }

        this.s3 = new S3Client({
            region: AWS_REGION,
            credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          },
        });
    }

    private async validate(
        classId: number, 
        topicId: number,
    ): Promise<void> {
        const ClassId = await this.classesRepository.findOne({
            where: { id: classId }
        })
        if (!ClassId) {
            throw new NotFoundException('강의를 찾을 수 없습니다.')
        }
        const DocName = await this.docNameRepository.findOne({
            where: { topic_id: topicId }
        })
        if (!DocName) {
            throw new NotFoundException('자료 주제를 찾을 수 없습니다.')
        }
    }

    async uploadFile(
        classId: number,
        topicId: number,
        createClassDocDto: CreateClassDocDto,
        file: Express.Multer.File
    ): Promise<string> {
        await this.validate(classId, topicId);
        const fileName = `${uuidv4()}-${file.originalname}`;
        const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
        if (!bucketName) {
            throw new Error('AWS S3 bucket name is not configured');
        }
        try {
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.s3.send(command);
            const url = `${fileName}`; // 저장할 객체 키 명시적으로 작성
            await this.saveFile(url);
            return url;
        } catch (error) {
            console.error('File upload error:', error);
            throw new InternalServerErrorException(`파일 업로드에 실패했습니다: ${error.message}`);
        }
    }
      

    async saveFile(
        file_path: string
    ): Promise<void> {
        try {
            const fileUpload = this.classDocRepository.create({
                file_path
            });
            await this.classDocRepository.save(fileUpload);
        } catch (error) {
            console.error('File save error:', error);
            throw new BadRequestException(`파일 URL 저장에 실패했습니다: ${error.message}`);
        }
    }
    
    async downloadFile(
        url: string
    ): Promise<{ stream: Readable; metadata: any }> {
        const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: url, // URL에서 추출한 객체 키 사용
        });
    
        try {
            const data = await this.s3.send(command);
            if (!data.Body) {
                throw new Error('파일 스트림을 가져올 수 없습니다.');
            }

            const stream = data.Body as Readable;
            return { 
                stream,
                metadata: {
                    ContentType: data.ContentType,
                    ContentLength: data.ContentLength,
                }
            };

        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            throw new InternalServerErrorException('파일 다운로드에 실패했습니다.');
        }
    }
    
    async findAll(
        classId: number,
        topicId: number,
    ): Promise<ClassDoc[]> {
        try {
            await this.validate(classId, topicId);
            return await this.classDocRepository.find();
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            throw new BadRequestException('전체 조회에 실패했습니다.');
        }
    }

    async findOne(
        classId: number, 
        topicId: number,
        id: number
    ): Promise<ClassDoc> {
        try {
            await this.validate(classId, topicId)
            const classDoc = await this.classDocRepository.findOne({
                where: { class_document_id: id },
                relations: ['docName'],
            });
            if (!classDoc) {
                throw new NotFoundException(`Class Document with id ${id} not found`);
            }
            return classDoc;
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            throw new BadRequestException('조회에 실패했습니다.');
        }
    }

    async findById(id: number): Promise<ClassDoc> {
        if (id <= 0) {
            throw new BadRequestException('유효하지 않은 ID입니다.');
        }
  
        const doc = await this.classDocRepository.findOne({
        where: { class_document_id: id },
        relations: ['class'],
        });
  
        if (!doc) {
            throw new NotFoundException('자료를 찾을 수 없습니다.');
        }
  
        return doc;
    }

    async remove(
        classId: number, 
        topicId: number,
        id: number
    ): Promise<void> {
        try {
            const classDoc = await this.findOne(classId, topicId, id);
            await this.classDocRepository.remove(classDoc);
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            throw new BadRequestException('삭제에 실패했습니다.');
        }
    }
}
