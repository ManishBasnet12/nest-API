// modules/review/review.controller.ts
import { Controller, Post, Get, Body, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth-guards';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(req.user.id, dto);
  }

  @Get('product/:productId')
  getByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.getProductReviews(productId);
  }

  @Post('product/:productId')
  updateReview(@Req() req, @Param('productId', ParseIntPipe) productId: number, @Body() dto: CreateReviewDto) {
    return this.reviewService.update(req.user.id, productId, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.reviewService.remove(req.user.id, id);
  }
}