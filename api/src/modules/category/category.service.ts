import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../../shared/upload/upload.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const { name, products } = createCategoryDto;

    const existingCategory = await this.prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await this.cloudinary.uploadImage(file, 'store/categories');
    }

    return this.prisma.category.create({
      data: {
        name,
        imageUrl,
        ...(products &&
          products.length > 0 && {
            products: {
              connect: products.map((id) => ({ id: Number(id) })),
            },
          }),
      },
      include: { products: true },
    });
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();
    return { data: categories };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const { name, products } = updateCategoryDto;

    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    if (name) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { name },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new Error('Category with this name already exists');
      }
    }

    let imageUrl: string | undefined;
    if (file) {
      if (category.imageUrl) {
        const publicId = this.cloudinary.extractPublicId(category.imageUrl);
        await this.cloudinary.deleteImage(publicId);
      }
      imageUrl = await this.cloudinary.uploadImage(file, 'store/categories');
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name,
        ...(imageUrl && { imageUrl }),
        ...(products &&
          products.length > 0 && {
            products: {
              set: products.map((id) => ({ id: Number(id) })),
            },
          }),
      },
      include: { products: true },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.imageUrl) {
      const publicId = this.cloudinary.extractPublicId(category.imageUrl);
      await this.cloudinary.deleteImage(publicId);
    }

    return this.prisma.category.delete({ where: { id } });
  }
}
