import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../files.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { File, FileSchema } from '../schemas/file.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

const mS3Instance = {
  upload: jest.fn().mockReturnThis(),
  getObject: jest.fn().mockReturnThis(),
  promise: jest.fn(),
  createReadStream: jest.fn().mockReturnThis(),
};

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mS3Instance) };
});

describe('FilesService', () => {
  let service: FilesService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let fileModel: Model<File>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    fileModel = mongoConnection.model(File.name, FileSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        ConfigService,
        {
          provide: getModelToken(File.name),
          useValue: fileModel,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    // configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create un nuevo file', async () => {
    const configService: any = {
      get: jest.fn().mockReturnValueOnce('Bucket'),
    };
    const file = Buffer.alloc(513, '0');
    // const filesService = new FilesService(configService);
    const newFile = await service.uploadPublicFile(
      Buffer.from('ok'),
      'image',
      '1',
    );
    console.log('newFile', newFile);
  });
});
