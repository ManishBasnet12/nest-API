import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Request, UseGuards, Query, ParseIntPipe,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth-guards';
import { RolesGuard } from 'src/common/role/roles.guard';
import { Public } from '../users/decotators/public.decorator';
import { Roles } from 'src/common/role/roles.decorator';
import { ProductQueryDto } from './dto/pagination.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Post()
  @Roles('SELLER', 'ADMIN')
  @UseInterceptors(FileInterceptor('image'))           // <-- 'image' = form-data field name
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,        // optional file
    @Request() req,
  ) {
    return this.productService.create(createProductDto, req.user.id, file);
  }

  @Public()
  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
  ) {
    return this.productService.searchProducts(query, page);
  }

  @Public()
  @Get('filter')
  async filter(@Query() query: ProductQueryDto) {
    return this.productService.filterProducts(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @Roles('SELLER', 'ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.update(+id, updateProductDto, file);
  }

  @Delete(':id')
  @Roles('SELLER', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}