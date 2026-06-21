import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductQueryDto } from './dto/pagination.dto';
import { CloudinaryService } from 'src/shared/upload/upload.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    sellerId: number,
    file?: Express.Multer.File,
  ) {
    const { categoryId, sellerId: _sellerId, ...productData } = createProductDto;

    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await this.cloudinary.uploadImage(file , 'store/products');
    }

    return this.prisma.product.create({
      data: {
        ...productData,
        imageUrl,
        seller: { connect: { id: Number(sellerId) } },
        ...(categoryId && {
          category: { connect: { id: Number(categoryId) } },
        }),
      },
    });
  }
async findAll(query: ProductQueryDto) {
  const {
    page = 1,
    limit = 10,
    categoryId,
    minPrice,
    maxPrice,
    sortBy,
  } = query;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined && { gte: Number(minPrice) }),
      ...(maxPrice !== undefined && { lte: Number(maxPrice) }),
    };
  }

  let orderBy: any = [{ createdAt: 'desc' }, { id: 'asc' }];
  if (sortBy === 'price_asc') orderBy = [{ price: 'asc' }, { id: 'asc' }];
  else if (sortBy === 'price_desc') orderBy = [{ price: 'desc' }, { id: 'asc' }];

  const [data, total] = await Promise.all([
    this.prisma.product.findMany({ where, skip, take: limit, orderBy }),
    this.prisma.product.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    const { categoryId, sellerId, ...productData } = updateProductDto;

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    let imageUrl: string | undefined;
    if (file) {
      if (product.imageUrl) {
        const publicId = this.cloudinary.extractPublicId(product.imageUrl);
        await this.cloudinary.deleteImage(publicId);
      }
      imageUrl = await this.cloudinary.uploadImage(file , 'store/products');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(imageUrl && { imageUrl }),
        ...(categoryId && { category: { connect: { id: Number(categoryId) } } }),
        ...(sellerId && { seller: { connect: { id: Number(sellerId) } } }),
      },
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    if (product.imageUrl) {
      const publicId = this.cloudinary.extractPublicId(product.imageUrl);
      await this.cloudinary.deleteImage(publicId);
    }

    return this.prisma.product.delete({ where: { id } });
  }

  async searchProducts(query: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
        include: { category: true },
        orderBy: [
          { _relevance: { fields: ['name'], search: query, sort: 'desc' } },
          { id: 'asc' },
        ],
      }),
      this.prisma.product.count({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return { data, meta: { total, page, lastPage: Math.ceil(total / limit) } };
  }

  async filterProducts(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined && { gte: Number(minPrice) }),
        ...(maxPrice !== undefined && { lte: Number(maxPrice) }),
      };
    }

    let orderBy: any = [{ createdAt: 'desc' }, { id: 'asc' }];
    if (sortBy === 'price_asc') orderBy = [{ price: 'asc' }, { id: 'asc' }];
    else if (sortBy === 'price_desc') orderBy = [{ price: 'desc' }, { id: 'asc' }];

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.product.count({ where }),
    ]);

    return { data, meta: { total, page, lastPage: Math.ceil(total / limit) } };
  }
}