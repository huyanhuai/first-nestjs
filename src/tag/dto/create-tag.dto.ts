import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTagDto {
    @ApiProperty({ description: '标签名称' })
    @IsNotEmpty({ message: '标签名称必填' })
    name: string;
}
