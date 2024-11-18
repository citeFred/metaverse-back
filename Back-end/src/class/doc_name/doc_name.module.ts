import { forwardRef, Module } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { DocNameController } from './doc_name.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassDoc } from '../class_doc/entities/class_doc.entity'
import { Class } from '../classes/entities/class.entity'
import { DocName } from './entities/doc_name.entity'
import { UsersModule } from '../../user/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Class, ClassDoc, DocName]),
        forwardRef(() => UsersModule),
    ],
    controllers: [DocNameController],
    providers: [DocNameService],
    exports: [DocNameService]
})
export class DocNameModule {}