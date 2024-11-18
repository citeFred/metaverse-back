import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; 
import { HashService } from '../auth/hash.service';
import { ProjectsModule } from '../project/projects/projects.module'; 
import * as dotenv from 'dotenv';
import { ExhibitionModule } from 'src/exhibition/exhibitions/exhibitions.module';
import { ExhibitionsDocModule } from 'src/exhibition/exhibitions_doc/exhibitions_doc.module';
import { ClassDocModule } from 'src/class/class_doc/class_doc.module';
import { DocNameModule } from 'src/class/doc_name/doc_name.module';
import { ProjectDocModule } from 'src/project/project_doc/project_doc.module';
import { FeedbackModule } from 'src/project/feedback/feedback.module';
dotenv.config();

 @Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => ProjectsModule),
        forwardRef(() => ExhibitionModule),
        forwardRef(() => ExhibitionsDocModule),
        forwardRef(() => ClassDocModule),
        forwardRef(() => DocNameModule),
        forwardRef(() => ProjectDocModule),
        forwardRef(() => FeedbackModule),
    ],
    providers: [UsersService,HashService],
    controllers: [UsersController],
    exports: [UsersService,HashService],
})
export class UsersModule {}