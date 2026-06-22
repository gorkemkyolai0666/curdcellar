import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.inventory.findMany({
      include: { batch: { include: { recipe: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.inventory.findUnique({
      where: { id },
      include: { batch: { include: { recipe: true } } },
    });
    if (!item) throw new NotFoundException('Stok kaydı bulunamadı');
    return item;
  }

  async create(data: any) {
    return this.prisma.inventory.create({
      data,
      include: { batch: true },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.inventory.update({
      where: { id },
      data,
      include: { batch: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inventory.delete({ where: { id } });
  }

  async getSummary() {
    const items = await this.prisma.inventory.findMany({
      include: { batch: { include: { recipe: true } } },
    });
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const byType = items.reduce((acc, item) => {
      const type = item.batch.recipe.cheeseType;
      acc[type] = (acc[type] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);
    return { totalQuantity, byType, itemCount: items.length };
  }
}
