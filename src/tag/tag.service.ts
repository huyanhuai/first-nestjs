import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  async create(name: string) {
    return await this.tagRepository.save({ name });
  }

  async findByIds(ids: string[]) {
    // return await this.tagRepository.findByIds(ids);
    return await this.tagRepository.find({
      where: { id: In(ids) },
    });
  }

}
