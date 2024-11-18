import { IsOptional, IsDate } from 'class-validator'

export class CreateClassDocDto {
    @IsDate()
    @IsOptional()
    upload_data?: Date = new Date(); // 자동

    @IsOptional()
    file?: Express.Multer.File; 
}