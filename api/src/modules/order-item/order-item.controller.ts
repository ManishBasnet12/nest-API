import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './order-item.service';
import { CreateOrderDto } from './dto/create-order-item.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth-guards';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const userId = req.user.id; // adjust if your JwtStrategy attaches user differently
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get()
  findAllByUser(@Req() req: any) {
    return this.ordersService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.ordersService.findOne(id, req.user.id);
  }
}