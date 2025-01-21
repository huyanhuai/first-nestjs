//    posts/posts.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import { Exclude } from 'class-transformer';
import { User } from "../user/entities/user.entity";
import { CategoryEntity } from "../category/entities/category.entity";
import { TagEntity } from "../tag/entities/tag.entity";

@Entity("posts")
export class PostsEntity {
    @PrimaryGeneratedColumn()
    id:number; // 标记为主列，值自动生成
    // 文章标题
    @Column({ length: 50 })
    title: string;
    // 文章内容
    @Column({ type: "mediumtext", default: null })
    content: string;
    // markdown 转 html,自动生成
    @Column({ type: "mediumtext", default: null, name: 'content_html' })
    contentHtml: string;
    // 摘要，自动生成
    @Column({ type: "text", default: null })
    summary: string;
    // 封面图
    @Column({ default: null, name: 'cover_url' })
    coverUrl: string;
    // 阅读量
    @Column({ type: "int", default: 0 })
    count: number;
    // 点赞量
    @Column({ type: "int", default: 0, name: 'like_count' })
    likeCount: number;
    // 推荐显示
    @Column({ type: "tinyint", default: 0, name: 'is_recommend' })
    isRecommend: number;
    // 文章状态
    @Column("simple-enum", { enum: ['draft', 'publish'] })
    status: string;
    // 作者
    @ManyToOne((type) => User, (user) => user.posts)
    author: User;

    // 分类
    @Exclude()
    @ManyToOne((type) => CategoryEntity, (category) => category.posts)
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity;
    
    // 标签
    @ManyToMany((type) => TagEntity, (tag) => tag.posts)
    @JoinTable({
        name: 'posts_tag',
        joinColumn: { name: 'post_id' },
        inverseJoinColumn: { name: 'tag_id' }
    })
    tags: TagEntity[];

    @Column({type: 'timestamp', name: 'publish_time', default: null})
    publishTime: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    create_time: Date

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    update_time: Date
}
