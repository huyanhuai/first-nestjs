import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PostsEntity } from '../../posts/posts.entity';

@Entity('category')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => PostsEntity, post => post.category)
    posts: PostsEntity[];

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
