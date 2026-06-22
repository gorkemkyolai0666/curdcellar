import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.recipe.findMany({
      include: { _count: { select: { batches: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: { batches: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!recipe) throw new NotFoundException('Tarif bulunamadı');
    return recipe;
  }

  async create(data: any) {
    return this.prisma.recipe.create({ data });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.recipe.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.recipe.delete({ where: { id } });
  }
}
