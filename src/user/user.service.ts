import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LeanUserDocument, User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'bcrypt';
import { CreateUserFromGoogleDto } from './dtos/create-user-from-google.dto';
import {
  LeanPasswordResetLinkDocument,
  PasswordResetLink,
} from './schemas/password-reset-link.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
    @InjectModel(PasswordResetLink.name)
    private readonly _passwordResetLinkModel: Model<LeanPasswordResetLinkDocument>,
  ) {}

  async findUserByEmail(email: string): Promise<LeanUserDocument> {
    return this._userModel.findOne({ email }).lean().exec();
  }

  async create(createUserDto: CreateUserDto): Promise<LeanUserDocument> {
    try {
      const hashedPassword = await hash(createUserDto.password, 10);
      const user = new this._userModel({
        ...createUserDto,
        password: hashedPassword,
        isRegisteredWithGoogle: false,
      });
      await user.save();
      return user;
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException('email already register');
      }
      throw new InternalServerErrorException();
    }
  }

  async createWithGoogle({
    email,
    firstName,
    picture,
  }: CreateUserFromGoogleDto): Promise<LeanUserDocument> {
    try {
      const user = new this._userModel({
        email,
        firstname: firstName,
        picture,
        isRegisteredWithGoogle: true,
      });
      await user.save();
      return user;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async getResetPasswordToken(email: string): Promise<string> {
    const passwordResetLink = new this._passwordResetLinkModel({
      email: email,
    });
    const link = await passwordResetLink.save();
    return link._id;
  }

  findResetLinkByToken(
    resetToken: string,
  ): Promise<LeanPasswordResetLinkDocument> {
    return this._passwordResetLinkModel
      .findOne({
        _id: resetToken,
      })
      .lean()
      .exec();
  }

  async changePassword(
    email: string,
    password: string,
  ): Promise<{ success: boolean }> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(
        `${user.email} is not a registered account.`,
      );
    }
    const hashedPassword = await hash(password, 10);
    await this._userModel.findByIdAndUpdate(
      { _id: user._id },
      { password: hashedPassword },
    );
    await this._passwordResetLinkModel.findOneAndDelete({ email });
    return { success: true };
  }
}
