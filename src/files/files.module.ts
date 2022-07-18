import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File, FileSchema } from './schemas/file.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Module } from '../thirdparties/s3/s3.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    S3Module,
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FileSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
