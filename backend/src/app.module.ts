import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { BatchModule } from './batch/batch.module';
import { AgingRoomModule } from './aging-room/aging-room.module';
import { RecipeModule } from './recipe/recipe.module';
import { QualityModule } from './quality/quality.module';
import { InventoryModule } from './inventory/inventory.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    BatchModule,
    AgingRoomModule,
    RecipeModule,
    QualityModule,
    InventoryModule,
    CustomerModule,
    OrderModule,
  ],
})
export class AppModule {}
