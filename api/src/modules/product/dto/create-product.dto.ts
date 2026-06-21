import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Headphones' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/...', required: false })
@IsString()
@IsOptional()
imageUrl?: string;

  @ApiProperty({ example: 'High-quality noise-canceling headphones', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 50, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: 1, description: 'The ID of the User who is selling the product' })
  @IsInt()
  @IsNotEmpty()
  sellerId!: number;

  @ApiProperty({ example: 2, required: false, description: 'The ID of the category' })
  @IsInt()
  @IsOptional()
  categoryId?: number;
}