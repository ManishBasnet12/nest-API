import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 🚀 1. IMPORT THIS
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ReviewModule } from './modules/review/review.module';
import { UploadModule } from './shared/upload/upload.module';

@Module({
  imports: [
    // 🚀 2. Load environment configurations FIRST before any feature module resolves
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule, 
    ProductModule, 
    CategoryModule, 
    CartModule, 
    OrderItemModule,
    PrismaModule,
    ReviewModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService], // 🚀 3. CLEANUP: Strip loose PrismaService & JwtStrategy declarations out of here
})
export class AppModule {}