import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  @Transform(({ obj }) => {
    if (obj._id && typeof obj._id.toString === 'function') {
      return obj._id.toString();
    } else {
      return obj;
    }
  })
  @Expose()
  public _id: string;

  @ApiProperty()
  @Expose()
  public url: string;

  @ApiProperty()
  @Expose()
  public key: string;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty()
  @Transform(({ obj }) => {
    if (obj.user._id && typeof obj.user._id.toString === 'function') {
      obj._id.toString();
    }
    return obj.user;
  })
  @Expose()
  public user: string;
}
