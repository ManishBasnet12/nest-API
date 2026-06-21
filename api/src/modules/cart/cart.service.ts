import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // 1. Get the cart with guaranteed item sorting
  async getCart(userId: number) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { id: 'asc' }, // 🚀 THE FIX: Guarantees items never jump around when updated!
    });

    const total = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    return {
      items,
      totalAmount: total,
      itemCount: items.length,
    };
  }

  // 2. Add/Adjust Item Quantity (Handles increments, decrements, and automatic zero-cleanup)
  async addToCart(userId: number, productId: number, quantity: number) {
    // Look up if the record already exists to check the target math
    const existingItem = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      // 🧼 Auto-cleanup: If a minus click drops the quantity to 0 or less, wipe it out
      if (newQuantity <= 0) {
        return this.removeFromCart(userId, productId);
      }
    }

    // Otherwise, perform standard upsert relative math
    return this.prisma.cartItem.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        quantity,
      },
    });
  }

  // 3. Sync local guest cart on login
  async syncCart(userId: number, guestItems: { productId: number, quantity: number }[]) {
    await Promise.all(
      guestItems.map((item) => this.addToCart(userId, item.productId, item.quantity))
    );
    return this.getCart(userId);
  }

  // 4. Remove a specific row
  async removeFromCart(userId: number, productId: number) {
    return this.prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  // 5. Clear out everything (e.g., successful checkout)
  async clearCart(userId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}