import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QualityService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.qualityCheck.findMany({
      include: { batch: { include: { recipe: true } } },
      orderBy: { checkDate: 'desc' },
    });
  }

  async findByBatch(batchId: string) {
    return this.prisma.qualityCheck.findMany({
      where: { batchId },
      orderBy: { checkDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const check = await this.prisma.qualityCheck.findUnique({
      where: { id },
      include: { batch: { include: { recipe: true } } },
    });
    if (!check) throw new NotFoundException('Kalite kontrolü bulunamadı');
    return check;
  }

  async create(data: any) {
    const { texture, flavor, appearance, aroma } = data;
    const overallScore = (texture + flavor + appearance + aroma) / 4;
    const passed = overallScore >= 6;

    return this.prisma.qualityCheck.create({
      data: { ...data, overallScore, passed },
      include: { batch: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.qualityCheck.delete({ where: { id } });
  }
}
