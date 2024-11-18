import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './user/users.module';
import { ExhibitionModule } from './exhibition/exhibitions/exhibitions.module';
import { ClassesModule } from './class/classes/classes.module';
import { DocNameModule } from './class/doc_name/doc_name.module';
import { MulterModule } from '@nestjs/platform-express';
import { ClassDocModule } from './class/class_doc/class_doc.module';
import { LessonModule } from './class/lesson/lesson.module';
import { ExhibitionsDocModule } from './exhibition/exhibitions_doc/exhibitions_doc.module';
import { ExhibitionsMemberModule } from './exhibition/exhibitions_member/exhibitions_member.module';
import { ExhibitionIntroModule } from './exhibition/exhibition_intro/exhibition_intro.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './project/projects/projects.module';
import { ProjectDocModule } from './project/project_doc/project_doc.module';
import { ProjectRegistrationModule } from './project/project_registration/registration.module';
import { FeedbackModule } from './project/feedback/feedback.module';
import { ClassRegistrationModule } from './class/class_registration/class_registration.module';
import { AttendanceModule } from './attendance/attendance.module';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(typeOrmConfig),
        MulterModule.register({
            dest: './uploads',
        }),
        AuthModule,
        UsersModule, AttendanceModule,
        ExhibitionsDocModule, ExhibitionsMemberModule, ExhibitionIntroModule, ExhibitionModule,
        ProjectsModule, ProjectDocModule, ProjectRegistrationModule, FeedbackModule,
        ClassesModule, ClassDocModule, ClassRegistrationModule, DocNameModule,
        LessonModule,
    ],
})
export class AppModule {}
