// auth.service.ts (수정된 부분)
import { Injectable, HttpException, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity'; 
import * as bcrypt from 'bcrypt';
import { LogInRequestDto } from './dto/log-in-request.dto';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private userService: UsersService,
    ) {}

    // 로그인
    async login(logInRequestDto: LogInRequestDto): Promise<{ token: string, user: User }> {
        const { email, password } = logInRequestDto;
        this.logger.verbose(`Attempting to sign in user with email: ${email}`);

        try {
            const existingUser = await this.findUserByEmail(email);

            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                this.logger.warn(`Failed login attempt for email: ${email}`);
                throw new UnauthorizedException('Incorrect email or password.');
            }

            // [1] JWT 토큰 생성 (Secret + Payload)
            const token = await this.generateJwtToken(existingUser);

            // [2] 사용자 정보 반환
            return { token, user: existingUser };
        } catch (error) {
            this.logger.error('Signin failed', error.stack);
            throw error;
        }
    }

    // 아이디로 유저 찾기 메서드
    private async findUserByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { email } });
    }

    // JWT 생성 공통 메서드
    async generateJwtToken(user: User): Promise<string> {
        
        // [1] JWT 토큰 생성 (Secret + Payload)
        const payload = { 
            username: user.user_name,
            email: user.email,
            userId: user.user_id,
            role: user.user_role,
            };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT Token: ${accessToken}`);
        this.logger.debug(`User details: ${JSON.stringify(user)}`);
        return accessToken;
    }
}
