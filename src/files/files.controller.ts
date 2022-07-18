import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Response } from 'express';
import { UpdateFileDto } from './dto/update-file.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetCurrentUserIdDecorator } from '../user/decorators/get-current-user-id.decorator';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { FileDto } from './dto/file.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dtos/error-response.dto';
import { ApiFile } from '../common/decorators/api-file.decorator';

@ApiTags('Files Management')
@ApiBearerAuth()
@Controller('files')
@Serialize(FileDto)
export class FilesController {
  constructor(private readonly _fileService: FilesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all save files of a user' })
  @ApiOkResponse({ type: [FileDto] })
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  getFilesByUser(@GetCurrentUserIdDecorator() id: string) {
    return this._fileService.getFilesByUser(id);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Upload a new file' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  uploadFile(
    @GetCurrentUserIdDecorator() id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._fileService.uploadPublicFile(
      file.buffer,
      file.originalname,
      id,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get a file' })
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this._fileService.getPrivateFile(id);
    // if you use postman please comment these two lines so that the file is displayed
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${file.info.originalName}`,
    );
    file.stream.pipe(res);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Rename a file previously uploaded in the database',
  })
  @ApiOkResponse({ type: () => FileDto })
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  updateFile(@Param('id') id: string, @Body() body: UpdateFileDto) {
    return this._fileService.update(id, body);
  }
}
