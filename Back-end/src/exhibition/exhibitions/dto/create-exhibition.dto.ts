import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateExhibitionDto {
    @IsString()
    @IsNotEmpty()
    generation: string;

    @IsString()
    @IsNotEmpty()
    exhibition_title: string;
    
    @IsString()
    @IsNotEmpty()
    team_name:string;

    @IsString()
    description: string;

    // 소개 멘트 배열
    @IsArray()
    @IsString({ each: true })
    introductions: string[];
}
