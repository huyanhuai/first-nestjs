import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('GET /app/list (getHello)', () => {
    return request(app.getHttpServer())
      .get('/app/list')
      .expect(200)
      .expect('Get');
  });

  it('POST /app/list (create)', () => {
    return request(app.getHttpServer())
      .post('/app/list')
      .expect(201)
      .expect('Post');
  });

  it('GET /app/user_123 (getUser)', () => {
    return request(app.getHttpServer())
      .get('/app/user_123')
      .expect(200)
      .expect('getUser');
  });

  it('PUT /app/list/123 (update)', () => {
    return request(app.getHttpServer())
      .put('/app/list/123')
      .expect(200)
      .expect('update');
  });

  afterAll(async () => {
    await app.close();
  });
});