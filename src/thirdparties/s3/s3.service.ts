import { Injectable, NotFoundException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import internal from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  private readonly bucket: string;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3();
    this.bucket = this.configService.get('AWS_PRIVATE_BUCKET_NAME');
  }

  public uploadFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<S3.ManagedUpload.SendData> {
    return this.s3
      .upload({
        Bucket: this.bucket,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
  }

  public getFile(key: string): internal.Readable {
    return this.s3
      .getObject({
        Bucket: this.bucket,
        Key: key,
      })
      .createReadStream()
      .on('error', (err) => {
        if (err.message === 'The specified key does not exist.') {
          throw new NotFoundException(
            `I can't find the key of the file please check that the key exists in the bucket, KEY:${key}`,
          );
        }
      });
  }
}
