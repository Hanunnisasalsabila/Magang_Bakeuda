import { Test, TestingModule } from '@nestjs/testing';
import { PejabatDesaController } from './pejabat-desa.controller';

describe('PejabatDesaController', () => {
  let controller: PejabatDesaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PejabatDesaController],
    }).compile();

    controller = module.get<PejabatDesaController>(PejabatDesaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
