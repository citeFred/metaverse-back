import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocName } from '../doc_name/entities/doc_name.entity'
import { UsersModule } from '../../user/users.module';
import { ProjectsModule } from '../../project/projects/projects.module';
import { ExhibitionModule } from '../../exhibition/exhibitions/exhibitions.module';
import { ExhibitionsDocModule } from '../../exhibition/exhibitions_doc/exhibitions_doc.module';
import { ClassDocModule } from '../class_doc/class_doc.module';
import { DocNameModule } from '../doc_name/doc_name.module';
import { ClassRegistration } from '../class_registration/entities/class_registration.entity';
import { ClassRegistrationModule } from '../class_registration/class_registration.module';
import { ProjectDocModule } from '../../project/project_doc/project_doc.module';
import { FeedbackModule } from '../../project/feedback/feedback.module';
import { Lesson } from '../lesson/entities/lesson.entity';
import { ClassesService } from './classes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Class, DocName, Lesson, ClassRegistration]),
        UsersModule, ProjectsModule, ExhibitionModule, ExhibitionsDocModule,
        ClassDocModule, DocNameModule, ClassRegistrationModule, ProjectDocModule,
        FeedbackModule
    ],
    providers: [ClassesService],
    controllers: [ClassesController],
    exports: [TypeOrmModule]
})
export class ClassesModule {}