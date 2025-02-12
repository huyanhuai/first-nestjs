import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

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

    @IsNumber({}, { message: '文章分类必须为数字' })
    @ApiProperty({ description: '文章分类' })
    readonly category: number;

    @ApiPropertyOptional({ description: '是否推荐' })
    readonly isRecommend: boolean;

    @ApiPropertyOptional({ description: '文章标签' })
    readonly tag: string;
}

export class PostInfoDto {
    public id: number;
    public title: string;
    public author: string;
    public content: string;
    public contentHtml: string;
    public summary: string;
    public toc: string;
    public coverUrl: string;
    public isRecommend: boolean;
    public status: string;
    public userId: string;
    public category: string;
    public tags: string[];
    public count: number;
    public likeCount: number;
}
