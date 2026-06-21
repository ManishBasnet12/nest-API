import { Module } from '@nestjs/common';
import { OrdersService } from './order-item.service';
import { OrdersController } from './order-item.controller';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrderItemModule {}
