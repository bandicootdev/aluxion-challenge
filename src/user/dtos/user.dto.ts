import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @Transform(({ obj }) => {
    if (obj._id && typeof obj._id.toString === 'function') {
      return obj._id.toString();
    } else {
      return obj;
    }
  })
  @ApiProperty()
  @Expose()
  public _id: string;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty()
  @Expose()
  public picture: string;

  @ApiProperty()
  @Exclude()
  public password: string;
}
