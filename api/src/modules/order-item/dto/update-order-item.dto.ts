import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order-item.dto';

export class UpdateOrderItemDto extends PartialType(CreateOrderDto) {}
