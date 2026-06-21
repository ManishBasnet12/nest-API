// orders.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './order-item.service';
import { CreateOrderDto } from './dto/create-order-item.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.ordersService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(+id, req.user.id);
  }
}