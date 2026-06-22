import { Test, TestingModule } from '@nestjs/testing';
import { BatchService } from './batch.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BatchService', () => {
  let service: BatchService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      batch: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BatchService>(BatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all batches', async () => {
    const result = await service.findAll();
    expect(result).toEqual([]);
    expect(prisma.batch.findMany).toHaveBeenCalled();
  });

  it('should return batch stats', async () => {
    const result = await service.getStats();
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('production');
    expect(result).toHaveProperty('aging');
    expect(result).toHaveProperty('ready');
  });
});
