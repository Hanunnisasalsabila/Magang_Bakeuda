import { Test, TestingModule } from '@nestjs/testing';
import { TransaksiSpopService } from './transaksi-spop.service';

describe('TransaksiSpopService', () => {
  let service: TransaksiSpopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransaksiSpopService],
    }).compile();

    service = module.get<TransaksiSpopService>(TransaksiSpopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
