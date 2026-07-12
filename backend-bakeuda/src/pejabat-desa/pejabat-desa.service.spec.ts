import { Test, TestingModule } from '@nestjs/testing';
import { PejabatDesaService } from './pejabat-desa.service';

describe('PejabatDesaService', () => {
  let service: PejabatDesaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PejabatDesaService],
    }).compile();

    service = module.get<PejabatDesaService>(PejabatDesaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
