import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { PostsEntity } from '../../posts/posts.entity';

@Entity('tag')
export class TagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // 标签名称
    @Column()
    name: string;

    @ManyToMany(() => PostsEntity, post => post.tags)
    posts: Array<PostsEntity>;

    @CreateDateColumn({
        name: 'create_time',
        type: 'timestamp',
        comment: '创建时间',
    })
    createTime: Date;

    @UpdateDateColumn({
        name: 'update_time',
        type: 'timestamp',
        comment: '更新时间',
    })
    updateTime: Date;
}
