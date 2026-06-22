import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgingRoomService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.agingRoom.findMany({
      include: { batches: { where: { status: { in: ['AGING', 'PRODUCTION'] } } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.agingRoom.findUnique({
      where: { id },
      include: { batches: { include: { recipe: true } } },
    });
    if (!room) throw new NotFoundException('Olgunlaştırma odası bulunamadı');
    return room;
  }

  async create(data: any) {
    return this.prisma.agingRoom.create({ data });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.agingRoom.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.agingRoom.delete({ where: { id } });
  }
}
