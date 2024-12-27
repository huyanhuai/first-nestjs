import { PostsService, PostsRo } from './posts.service';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('文章')
@Controller('post')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    /**
     * 创建文章
     * @param post
     */
    @ApiOperation({ summary: '创建文章' })
    @Post('/create')
    async create(@Body() post: CreatePostDto) {
        return await this.postsService.create(post);
    }

    /**
     * 获取文章列表
     * @param query
     */
    @ApiOperation({ summary: '获取文章列表' })
    @Get('/list')
    async findAll(@Query() query): Promise<PostsRo> {
        return await this.postsService.findAll(query);
    }

    /**
     * 获取指定文章
     * @param id
     */
    @ApiOperation({ summary: '获取指定文章' })
    @Get(':id')
    async findById(@Param('id') id) {
        return await this.postsService.findById(id);
    }

    /**
     * 更新文章
     * @param id
     * @param post
     */
    @ApiOperation({ summary: '更新文章' })
    @Put(':id')
    async update(@Param('id') id, @Body() post) {
        return await this.postsService.updateById(id, post);
    }

    /**
     * 删除文章
     * @param id
     */
    @ApiOperation({ summary: '删除文章' })
    @Delete(':id')
    async delete(@Param('id') id) {
        return await this.postsService.remove(id);
    }
}
