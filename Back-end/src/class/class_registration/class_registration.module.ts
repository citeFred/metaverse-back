import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassRegistrationService } from './class_registration.service';
import { ClassRegistrationController } from './class_registration.controller';
import { ClassRegistration } from './entities/class_registration.entity';
import { Class } from '../classes/entities/class.entity';
import { User } from 'src/user/user.entity';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassRegistration, Class, User]),
    forwardRef(() => UsersModule),
],
  controllers: [ClassRegistrationController],
  providers: [ClassRegistrationService],
  exports: [ClassRegistrationService],
})
export class ClassRegistrationModule {}