import { Module } from '@nestjs/common';
import { UnsplashService } from './unsplash.service';
import { UnsplashController } from './unsplash.controller';
import { FilesModule } from '../../files/files.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [FilesModule, HttpModule],
  providers: [UnsplashService],
  controllers: [UnsplashController],
})
export class UnsplashModule {}
