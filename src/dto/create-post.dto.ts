import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
    @ApiProperty({ description: '文章标题' })
    @IsNotEmpty({ message: '文章标题必填' })
    readonly title: string;

    // @ApiProperty({ description: '文章作者' })
    // @IsNotEmpty({ message: '缺少作者信息' })
    // readonly author: string;

    @ApiPropertyOptional({ description: '文章内容' })
    readonly content: string;

    @ApiPropertyOptional({ description: '封面图' })
    readonly coverUrl: string;

    @ApiProperty({ description: '文章状态' })
    readonly status: string;
}

