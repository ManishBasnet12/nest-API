import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order-item.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto, userId: number) {
    const {
      items,
      fullName,
      phoneNumber,
      streetAddress,
      city,
      stateRegion,
      postalCode,
    } = createOrderDto;

    const calculatedTotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    return this.prisma.order.create({
      data: {
        totalPrice: calculatedTotal,
        status: 'PENDING',
        fullName,
        phoneNumber,
        streetAddress,
        city,
        stateRegion,
        postalCode,
        user: { connect: { id: userId } },
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true }, // MUST match schema: items
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          // MUST match schema: items
          include: { product: true },
        },
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
