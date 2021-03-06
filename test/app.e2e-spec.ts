import request from 'supertest';
import { Test } from '@nestjs/testing';
import { ApiModule } from '../src/api/api.module';
import { INestApplication } from '@nestjs/common';

describe('ApiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
