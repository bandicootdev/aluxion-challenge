import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { File, FileDocument, LeanFileDocument } from './schemas/file.schema';
import { UpdateFileDto } from './dto/update-file.dto';
import { S3Service } from '../thirdparties/s3/s3.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly _fileModel: Model<FileDocument>,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  public async getFilesByUser(userId: string): Promise<LeanFileDocument[]> {
    return this._fileModel.find({ user: userId }).lean().exec();
  }

  public async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    userId: string,
  ) {
    try {
      const uploadResult = await this.s3Service.uploadFile(
        dataBuffer,
        `${uuid()}-${filename}`,
      );
      const newFile = new this._fileModel({
        key: uploadResult.Key,
        url: uploadResult.Location,
        user: userId,
        name: filename,
        originalName: filename,
      });
      await newFile.save();
      return newFile;
    } catch (err) {
      throw err;
    }
  }

  public async getPrivateFile(id: string) {
    const fileInfo = await this._fileModel.findOne({ _id: id });
    if (fileInfo) {
      const stream = this.s3Service.getFile(fileInfo.key);
      return {
        stream,
        info: fileInfo,
      };
    }
  }

  public update(id: string, file: UpdateFileDto): Promise<LeanFileDocument> {
    try {
      return this._fileModel
        .findByIdAndUpdate({ _id: id }, { ...file }, { new: true })
        .lean()
        .exec();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
