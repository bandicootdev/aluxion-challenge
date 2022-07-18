import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
