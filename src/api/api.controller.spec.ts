import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

describe('ApiController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [ApiService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<ApiController>(ApiController);
      expect(appController.root()).toBe('Hello World!');
    });
  });
});
