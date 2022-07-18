import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ErrorInternal {
  @ApiProperty()
  @Expose()
  statusCode: number;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  error: string;
}

export class ErrorResponseDto {
  @ApiProperty()
  @Expose()
  statusCode: number;

  @ApiProperty()
  @Expose()
  timestamp: Date;

  @ApiProperty()
  @Expose()
  path: string;

  @ApiProperty()
  @Expose()
  @Type(() => ErrorInternal)
  error: ErrorInternal;
}
