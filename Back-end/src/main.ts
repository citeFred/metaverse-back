import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // 유효성 검사 전역 설정
    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: (errors) => new BadRequestException(errors),
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    // 최대 요청 크기 설정 (예: 10MB)
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

    // CORS 설정
    app.enableCors({
        origin: 'http://localhost:4200',  // 특정 출처를 명시
        credentials: true,  // 'withCredentials'를 사용하려면 'true'로 설정
    });

    await app.listen(3000);
}
bootstrap();