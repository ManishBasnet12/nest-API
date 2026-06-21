import { Module, Global } from '@nestjs/common';
import { CloudinaryProvider } from './upload.controller';
import { CloudinaryService } from './upload.service';

@Global() // Makes UploadService available everywhere without re-importing
@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class UploadModule {}