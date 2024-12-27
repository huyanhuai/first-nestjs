import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ length: 100 })
    username: string; // 用户名

    @Column({ length: 100, nullable: true })
    nickname: string; // 昵称

    @Exclude() // 表示在序列化时将此列忽略
    @Column({ select: false }) // 表示隐藏此列
    password: string; // 密码

    @Column({ nullable: true })
    avatar: string; // 头像

    @Column('simple-enum', { enum: ['root', 'author', 'visitor'] })
    role: string; // 角色

    @Column({
        name: 'create_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createTime: Date; // 创建时间

    @Column({
        name: 'update_time',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updateTime: Date; // 更新时间

    @BeforeInsert()
    async encryptPwd() {
        /**
         * 加密处理 - 同步方法
         * bcryptjs.hashSync(data, salt)
         *    - data  要加密的数据
         *    - slat  用于哈希密码的盐。如果指定为数字，则将使用指定的轮数生成盐并将其使用。推荐 10
         */
        this.password = await bcryptjs.hashSync(this.password, 10);
    }
}
