import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { userGoogleStub, userStub } from './stubs/user.stub';
import {
  PasswordResetLink,
  PasswordResetLinkSchema,
} from '../schemas/password-reset-link.schema';

describe('UserService', () => {
  let service: UserService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let passwordResetLinkModel: Model<PasswordResetLink>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    passwordResetLinkModel = mongoConnection.model(
      PasswordResetLink.name,
      PasswordResetLinkSchema,
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
        {
          provide: getModelToken(PasswordResetLink.name),
          useValue: passwordResetLinkModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('create new user', () => {
    it('should get add and get a user', async () => {
      const newUser = await service.create(userStub());
      expect(newUser.email).toBe(userStub().email);
    });

    it('should get a user already created before', async () => {
      const newUser = await service.create(userStub());
      const user = await service.findUserByEmail(newUser.email);
      expect(user.email).toBe(newUser.email);
    });

    it('should get add and get a user as google user', async () => {
      const newUserGoogle = await service.createWithGoogle(userGoogleStub());
      expect(newUserGoogle.email).toBe(userGoogleStub().email);
      expect(newUserGoogle.isRegisteredWithGoogle).toBe(true);
    });

    it('should get a token for the link', async () => {
      const newUser = await service.create(userStub());
      const passwordResetLink = await service.getResetPasswordToken(
        newUser.email,
      );
      expect(passwordResetLink.toString()).toBeDefined();
    });

    it('should get create a new token and get it', async () => {
      const newUser = await service.create(userStub());
      const passwordResetLink = await service.getResetPasswordToken(
        newUser.email,
      );
      const token = await service.findResetLinkByToken(
        passwordResetLink.toString(),
      );
      expect(token._id.toString()).toBe(passwordResetLink.toString());
    });

    it('should create a user and change the password', async () => {
      const newUser = await service.create(userStub());
      const changePassword = await service.changePassword(
        newUser.email,
        '132456789',
      );
      expect(changePassword.success).toBe(true);
    });
  });
});
