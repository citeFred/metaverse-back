import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocName } from '../doc_name/entities/doc_name.entity'
import { UsersModule } from '../../user/users.module';
import { ProjectsModule } from '../../project/projects/projects.module';
import { ExhibitionModule } from '../../exhibition/exhibitions/exhibitions.module';
import { ExhibitionsDocModule } from '../../exhibition/exhibitions_doc/exhibitions_doc.module';
import { CourseDocModule } from '../course_doc/course_doc.module';
import { DocNameModule } from '../doc_name/doc_name.module';
import { CourseRegistration } from '../course_registration/entities/course_registration.entity';
import { CourseRegistrationModule } from '../course_registration/course_registration.module';
import { ProjectDocModule } from '../../project/project_doc/project_doc.module';
import { FeedbackModule } from '../../project/feedback/feedback.module';
import { Lesson } from '../lesson/entities/lesson.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Course, DocName, Lesson, CourseRegistration]),
        UsersModule, ProjectsModule, ExhibitionModule, ExhibitionsDocModule,
        CourseDocModule, DocNameModule, CourseRegistrationModule, ProjectDocModule,
        FeedbackModule
    ],
    providers: [CoursesService],
    controllers: [CoursesController],
    exports: [TypeOrmModule]
})
export class CoursesModule {}