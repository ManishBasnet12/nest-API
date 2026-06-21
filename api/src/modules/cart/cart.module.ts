import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[UsersModule], // Import AuthModule to access JWT strategy and guards
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
