import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { createApi } from 'unsplash-js';
import { FilesService } from '../../files/files.service';
import { HttpService } from '@nestjs/axios';
import { UpdateFileToS3Dto } from './dtos/update-file-to-s3.dto';
import { SearchPhotosDto } from './dtos/search-photos.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UnsplashService {
  private unsplash: any;
  constructor(
    private _fileService: FilesService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.unsplash = createApi({
      accessKey: this.configService.get('UNSPLASH_ACCESS_KEY'),
    });
  }

  async getAllPhotos(query: SearchPhotosDto) {
    try {
      const photos = await this.unsplash.search.getPhotos({
        ...query,
      });
      if (photos.type === 'success') {
        return photos.response.results;
      }
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async uploadInS3(file: UpdateFileToS3Dto, userId: string) {
    const { type, response } = await this.unsplash.photos.get({
      photoId: file.externalUnsplashId,
    });

    if (type === 'error') {
      throw new BadRequestException('check photo id');
    }

    if (type === 'success') {
      const {
        response: { url },
      } = await this.unsplash.photos.trackDownload({
        downloadLocation: response.links.download_location,
      });
      const { data } = await this.httpService.axiosRef({
        url,
        method: 'GET',
        responseType: 'stream',
        params: {
          client_id: this.configService.get('UNSPLASH_ACCESS_KEY'),
        },
      });
      return this._fileService.uploadPublicFile(data, file.name, userId);
    }
  }
}
