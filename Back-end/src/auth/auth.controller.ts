import { Controller, Post, Body, Logger, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LogInRequestDto } from './dto/log-in-request.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { ApiResponse } from 'src/common/api-response.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginRequestDto: LogInRequestDto, @Res() res: Response): Promise<void> {
        this.logger.verbose(`Attempting to sign in user with email: ${loginRequestDto.email}`);
        const {token, user } = await this.authService.login(loginRequestDto);
        const userResponseDto = new UserResponseDto(user);
        this.logger.verbose(`User signed in successfully: ${JSON.stringify(userResponseDto)}`);

        res.status(200).json(new ApiResponse(true, 200, 'Sign in successful', { token, user: userResponseDto }));
    }
}