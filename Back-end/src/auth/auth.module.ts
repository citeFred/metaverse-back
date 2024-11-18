import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../user/user.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './roles.guard';
import { UsersModule } from '../user/users.module';
import { OwnershipGuard } from './ownership.guard';
import { ClassesModule } from '../class/classes/classes.module';
import { ProjectsModule } from '../project/projects/projects.module';
import { ExhibitionModule } from '../exhibition/exhibitions/exhibitions.module';
import { ExhibitionsDocModule } from '../exhibition/exhibitions_doc/exhibitions_doc.module';
import { ClassDocModule } from '../class/class_doc/class_doc.module';
import { DocNameModule } from '../class/doc_name/doc_name.module';
import { ProjectDocModule } from '../project/project_doc/project_doc.module';
import { FeedbackModule } from '../project/feedback/feedback.module';
@Global()
@Module({
    imports: [
        UsersModule, ClassesModule, ProjectsModule, ExhibitionModule,
        ExhibitionsDocModule, ClassDocModule, DocNameModule, ProjectDocModule, FeedbackModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        RolesGuard,
        OwnershipGuard,
    ],
    controllers: [AuthController],
    exports: [AuthService,RolesGuard,OwnershipGuard],
})
export class AuthModule {}