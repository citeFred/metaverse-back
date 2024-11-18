import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DocName } from './entities/doc_name.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';
import { Class } from '../classes/entities/class.entity';

@Injectable()
export class DocNameService {
    constructor(
        @InjectRepository(DocName)
        private docNameRepository: Repository<DocName>,
        @InjectRepository(Class)
        private readonly classRepository: Repository<Class>,
    ) {}

    async create(
        classId: number, 
        createDocNameDto: CreateDocNameDto
    ): Promise<DocName> {
        const foundClass = await this.classRepository.findOne({ 
            where: { id: classId }
        })
        if (!foundClass) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const docName = this.docNameRepository.create({...createDocNameDto});
        return await this.docNameRepository.save(docName);
    }

    async findAll(
        classId: number, 
    ): Promise<DocName[]> {
        const foundClass = await this.classRepository.findOne({ 
            where: { id: classId }
        });
        if (!foundClass) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        return await this.docNameRepository.find();
    }

    async update(
        classId: number, 
        topicId: number, 
        updateDocNameDto: UpdateDocNameDto
    ): Promise<DocName> {
        const docName = await this.findOne(classId, topicId);
        await this.docNameRepository.update(docName.topic_id, updateDocNameDto);
        const newTopicId = topicId
        return this.findOne(classId, newTopicId);
    }

    async remove(
        classId: number, 
        topicId: number
    ): Promise<void> {
        const docName = await this.findOne(classId, topicId);
        await this.docNameRepository.remove(docName);
    }

    async findOne(
        classId: number, 
        topicId: number
    ): Promise<DocName> {
        const foundClass = await this.classRepository.findOne({
            where: { id: classId }
        });
        if (!foundClass) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const docName = await this.docNameRepository.findOne({ 
            where: { topic_id: topicId },
            relations: ['classDocs']
        });
        if (!docName) {
            throw new NotFoundException(`DocName with title ${topicId} not found`);
        }
        return docName;
    }

    // pa_topic_id이 null인 topic 조회 메서드
    async findRootDocName(
        classId: number
    ): Promise<DocName> {
        const foundClass = await this.classRepository.findOne({
            where: { id: classId }
        });
        if (!foundClass) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const docnames = await this.docNameRepository.findOne({
            where : { pa_topic_id: null }
        });
        return docnames
    }
    // 특정 pa_topic_id를 갖는 topic 조회 메서드 추가 작성 필요 

  
    async findById(id: number): Promise<DocName> {
        if (id <= 0) {
            throw new BadRequestException('유효하지 않은 ID입니다.');
        }
  
        const doc = await this.docNameRepository.findOne({
        where: { topic_id: id },
        relations: ['class'],
        });
  
        if (!doc) {
            throw new NotFoundException('자료를 찾을 수 없습니다.');
        }
        return doc;
    }
}