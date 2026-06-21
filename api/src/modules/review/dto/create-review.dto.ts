import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {

  @ApiProperty()
  @IsNumber()
  productId!: number;

  @ApiProperty()
  @IsNumber()
  rating!: number;

  @ApiProperty()
  @IsString()
  comment!: string;

}
