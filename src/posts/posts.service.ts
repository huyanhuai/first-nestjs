import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { CategoryService } from '../category/category.service'
import { TagService } from '../tag/tag.service';
import { CreatePostDto, PostInfoDto } from './dto/create-post.dto';

export interface PostsRo {
    list: PostInfoDto[],
    count: number
}

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsEntity)
        private readonly postsRepository: Repository<PostsEntity>,
        private readonly categoryService: CategoryService,
        private readonly tagService: TagService
    ) {}

    // 创建文章
    async create(user, post: CreatePostDto): Promise<number> {
        const { title } = post;
        if (!title) {
            throw new HttpException('缺少标题', 401);
        }
        const doc = await this.postsRepository.findOne({ where: { title } });
        if (doc) {
          throw new HttpException('文章已存在', 401);
        }

        let { status, isRecommend, coverUrl, tag, category = 0 } = post;
        
        // 根据分类id获取分类
        const categoryDoc = await this.categoryService.findById(category);
        // 根据传入的标签id,如 `1,2`,获取标签
        const tags = await this.tagService.findByIds(('' + tag).split(','));
        const postParam: Partial<PostsEntity> = { 
            ...post,
            isRecommend: isRecommend ? 1 : 0,
            author: user,
            category: categoryDoc,
            tags: tags,
        };
        // 判断状态，为publish则设置发布时间
        if (status === 'publish') {
            Object.assign(postParam, { publishTime: new Date() });
        }

        const newPost: PostsEntity = await this.postsRepository.create({
            ...postParam,
        });
        const created = await this.postsRepository.save(newPost);
        return created.id;
    }

    // 获取文章列表
    async findAll(query): Promise<PostsRo> {
        const qb = await this.postsRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'user')
        .leftJoinAndSelect('post.category', 'category')
        .leftJoinAndSelect('post.tags', 'tag')
        .orderBy('post.updateTime', 'DESC');

        qb.where('1 = 1');
        qb.orderBy('post.createTime', 'DESC');

        const { pageNum = 1, pageSize = 10, ...params } = query;
        // 根据传入的参数构建查询
        if (params.category) {
            qb.where('post.category = :category', { category: params.category });
        }
        if (params.tag) {
            // 多个tag查询
            let tag = ('' + params.tag).split(',');
            qb.andWhere('tag.id IN (:...tag)', { tag });
        }
        const count = await qb.getCount();
        qb.limit(pageSize);
        qb.offset(pageSize * (pageNum - 1));

        // qb.printSql();
        // qb.getMany();
    
        const posts = await qb.getMany();
        const result: PostInfoDto[] = posts.map(post => post.toResponseObject());
        return { list: result, count: count };

        // 使用find 方式实现
        // const { pageNum = 1, pageSize = 10, ...params } = query;
        // const result = await this.postsRepository.findAndCount({
        //     relations: ['author', 'category', 'tags'],
        //     take: pageSize,
        //     skip: pageSize * (pageNum - 1),
        //     order: { id: 'DESC' },
        // });
        // const list = result[0].map(post => post.toResponseObject());
        // return { list, count: result[1] };
    }

    // 获取指定文章
    async findById(id): Promise<PostInfoDto> {
        const qb = await this.postsRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'user')
        .leftJoinAndSelect('post.category', 'category')
        .leftJoinAndSelect('post.tags', 'tag')
        .where('post.id = :id', { id });
        
        const result = await qb.getOne();
        if (!result) {
            throw new HttpException(`id为${id}的文章不存在`, 401);
        }
        await this.postsRepository.update({ id }, {count: result.count + 1}); // 更新阅读量
        return result.toResponseObject();
    }

    // 更新文章
    async updateById(id, post): Promise<number> {
        const existPost  = await this.postsRepository.findOne({ where: { id } });
        if (!existPost) {
            throw new HttpException(`id为${id}的文章不存在`, 401);
        }

        const { tag, category, status } = post;
        const tags = await this.tagService.findByIds(('' + tag).split(','));
        const categoryDoc = await this.categoryService.findById(category);
        const newPost  = {
            ...post,
            isRecommend: post.isRecommend ? 1 : 0,
            tags,
            category: categoryDoc,
            publishTime: status === 'publish' ? new Date() : existPost.publishTime,
        }
        const updatePost = this.postsRepository.merge(existPost, newPost);
        return (await this.postsRepository.save(updatePost)).id;
    }

    // 删除文章
    async remove(id): Promise<PostsEntity> {
        const existPost  = await this.postsRepository.findOne({ where: { id } });
        if (!existPost) {
            throw new HttpException(`id为${id}的文章不存在`, 401);
        }
        return await this.postsRepository.remove(existPost);
    }
}
