// modules/review/review.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    try {
      return await this.prisma.review.create({
        data: {
          rating: dto.rating,
          comment: dto.comment,
          user: { connect: { id: userId } },
          product: { connect: { id: dto.productId } },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('You have already reviewed this product');
      }
      throw error;
    }
  }

  async getProductReviews(productId: number) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { name: true } }, // Don't return passwords!
      },
      orderBy: { createdAt: 'desc' },
    });
  }


  async update(userId: number,productId: number, dto: CreateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!review) {
      throw new BadRequestException('Review not found');
    }
    return this.prisma.review.update({
      where: { userId_productId: { userId, productId } },
      data: { rating: dto.rating, comment: dto.comment },
    });


  }

  async remove(userId: number, reviewId: number) {
    // Ensure the user owns the review before deleting
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    
    if (!review || review.userId !== userId) {
      throw new BadRequestException('Review not found or unauthorized');
    }

    return this.prisma.review.delete({ where: { id: reviewId } });
  }
}