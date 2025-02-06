import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('文章分类')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '创建文章分类' })
  @Post('/create')
  create(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body.name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findById(+id);
  }
}
