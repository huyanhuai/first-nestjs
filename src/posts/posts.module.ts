import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';
import { UserModule } from '../user/user.module';
import { TagModule } from '../tag/tag.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity]), UserModule, TagModule, CategoryModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
