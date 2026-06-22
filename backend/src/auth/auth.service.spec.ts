import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwt = {
      sign: jest.fn().mockReturnValue('test-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'x@x.com', password: '123' }))
      .rejects.toThrow(UnauthorizedException);
  });

  it('should return token on successful login', async () => {
    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash('demo123456', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: '1', email: 'demo@peynirmahzeni.com.tr', password: hashed, name: 'Demo', role: 'ADMIN',
    });

    const result = await service.login({ email: 'demo@peynirmahzeni.com.tr', password: 'demo123456' });
    expect(result.access_token).toBe('test-token');
    expect(result.user.email).toBe('demo@peynirmahzeni.com.tr');
  });
});
