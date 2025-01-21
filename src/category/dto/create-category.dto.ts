import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: '分类名称' })
    @IsNotEmpty({ message: '分类名称必填' })
    name: string;
}
