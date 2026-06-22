import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {};
    return this.prisma.order.findMany({
      where,
      include: { customer: true, items: true },
      orderBy: { orderDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { customer: true, items: true },
    });
    if (!order) throw new NotFoundException('Sipariş bulunamadı');
    return order;
  }

  async create(data: any) {
    const { items, ...orderData } = data;
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.total, 0);

    return this.prisma.order.create({
      data: {
        ...orderData,
        totalAmount,
        items: { create: items },
      },
      include: { customer: true, items: true },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const { items, ...orderData } = data;

    if (items) {
      await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
      const totalAmount = items.reduce((sum: number, item: any) => sum + item.total, 0);
      return this.prisma.order.update({
        where: { id },
        data: { ...orderData, totalAmount, items: { create: items } },
        include: { customer: true, items: true },
      });
    }

    return this.prisma.order.update({
      where: { id },
      data: orderData,
      include: { customer: true, items: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
    return this.prisma.order.delete({ where: { id } });
  }

  async getStats() {
    const [total, pending, confirmed, delivered] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
    ]);
    const revenue = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] } },
    });
    return { total, pending, confirmed, delivered, revenue: revenue._sum.totalAmount || 0 };
  }
}
