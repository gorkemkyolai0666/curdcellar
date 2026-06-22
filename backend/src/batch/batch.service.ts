import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BatchService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {};
    return this.prisma.batch.findMany({
      where,
      include: { recipe: true, agingRoom: true, qualityChecks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: { recipe: true, agingRoom: true, qualityChecks: true, inventory: true },
    });
    if (!batch) throw new NotFoundException('Parti bulunamadı');
    return batch;
  }

  async create(data: any) {
    return this.prisma.batch.create({
      data,
      include: { recipe: true, agingRoom: true },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.batch.update({
      where: { id },
      data,
      include: { recipe: true, agingRoom: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.batch.delete({ where: { id } });
  }

  async getStats() {
    const [total, production, aging, ready] = await Promise.all([
      this.prisma.batch.count(),
      this.prisma.batch.count({ where: { status: 'PRODUCTION' } }),
      this.prisma.batch.count({ where: { status: 'AGING' } }),
      this.prisma.batch.count({ where: { status: 'READY' } }),
    ]);
    return { total, production, aging, ready };
  }
}
