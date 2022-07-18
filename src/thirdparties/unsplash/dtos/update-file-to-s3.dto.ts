import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFileToS3Dto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  externalUnsplashId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
