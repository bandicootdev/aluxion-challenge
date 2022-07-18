import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UnsplashService } from './unsplash.service';
import { UpdateFileToS3Dto } from './dtos/update-file-to-s3.dto';
import { SearchPhotosDto } from './dtos/search-photos.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetCurrentUserIdDecorator } from '../../user/decorators/get-current-user-id.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileDto } from '../../files/dto/file.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { ErrorResponseDto } from '../../common/dtos/error-response.dto';

@ApiTags('Unsplash Management')
@ApiBearerAuth()
@Controller('unsplash')
export class UnsplashController {
  constructor(private readonly _unsplashService: UnsplashService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all Unsplash photos with search included' })
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  getAll(@Query() query: SearchPhotosDto) {
    return this._unsplashService.getAllPhotos(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Serialize(FileDto)
  @ApiOperation({ description: 'upload a photo from unsplash to aws s3' })
  @ApiOkResponse({ type: () => FileDto })
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  uploadPhotoS3(
    @GetCurrentUserIdDecorator() id: string,
    @Body() body: UpdateFileToS3Dto,
  ) {
    try {
      return this._unsplashService.uploadInS3(body, id);
    } catch (err) {
      throw err;
    }
  }
}
