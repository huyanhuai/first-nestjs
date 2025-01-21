import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('文章标签')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '创建文章标签' })
  @Post('/create')
  create(@Body() body: CreateTagDto) {
    return this.tagService.create(body.name);
  }
}
