import { Controller, Post, Body, Get, Delete, UseGuards, Req, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../users/guards/jwt-auth-guards';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('sync')
  async syncCart(@Req() req, @Body() guestItems:CreateCartDto []) {
    return this.cartService.syncCart(req.user.id, guestItems);
  }

  @Get()
  async getMyCart(@Req() req) {
    console.log('Fetching cart for user ID:', req.user);
    return this.cartService.getCart(req.user.id);
  }

  @Post('add')
  async addToCart(@Req() req, @Body() body: CreateCartDto) {
    return this.cartService.addToCart(req.user.id, body.productId, body.quantity);
  }

  @Delete(':productId')
  async removeItem(@Req() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @Delete()
  async clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}