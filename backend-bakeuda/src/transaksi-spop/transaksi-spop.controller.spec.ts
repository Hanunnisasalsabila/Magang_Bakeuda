import { Test, TestingModule } from '@nestjs/testing';
import { TransaksiSpopController } from './transaksi-spop.controller';

describe('TransaksiSpopController', () => {
  let controller: TransaksiSpopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransaksiSpopController],
    }).compile();

    controller = module.get<TransaksiSpopController>(TransaksiSpopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
