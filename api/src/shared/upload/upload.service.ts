import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File, folder: string = 'store/products'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
        },
        // Fix: result typed as UploadApiResponse | undefined, then narrowed
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(new BadRequestException(error?.message ?? 'Image upload failed'));
          }
          resolve(result.secure_url);
        },
      );

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  extractPublicId(url: string): string {
    const parts = url.split('/');
    const fileWithExt = parts[parts.length - 1];
    const file = fileWithExt.split('.')[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${file}`;
  }
}