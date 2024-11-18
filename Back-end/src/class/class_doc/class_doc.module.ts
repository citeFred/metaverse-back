import { forwardRef, Module } from '@nestjs/common';
import { ClassDocService } from './class_doc.service';
import { ClassDocController } from './class_doc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassDoc } from './entities/class_doc.entity'
import { DocName } from '../doc_name/entities/doc_name.entity'
import { ConfigModule } from '@nestjs/config';
import { Class } from '../classes/entities/class.entity';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../../user/users.module';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([ClassDoc, DocName, Class]),
        forwardRef(() => UsersModule),
    ],
    controllers: [ClassDocController],
    providers: [ClassDocService, ConfigService],
    exports: [ClassDocService],
})
export class ClassDocModule {}