import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  @Expose()
  access_token: string;
}
