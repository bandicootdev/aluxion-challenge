import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LeanUserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { TokenInterface } from './interfaces/token.interface';
import { EmailService } from '../email/email.service';
import { ResetPasswordDto } from '../user/dtos/reset-pasword.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly _userService: UserService,
    private _jwtService: JwtService,
    private _configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async googleLogin(req): Promise<TokenInterface | string> {
    const user = await this._userService.findUserByEmail(req.user.email);
    if (!req.user) {
      return 'No user from google';
    }
    if (!user) {
      const newUser = await this._userService.createWithGoogle(req.user);
      const payload: Partial<JwtPayloadInterface> = {
        _id: newUser._id,
        email: newUser.email,
      };
      return this.getTokens(payload);
    }
    const payload: Partial<JwtPayloadInterface> = {
      _id: user._id,
      email: user.email,
    };
    return this.getTokens(payload);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<LeanUserDocument> {
    const user = await this._userService.findUserByEmail(email);
    if (user && user.password) {
      if (user && (await compare(password, user.password))) {
        return user;
      }
      return null;
    }
    return null;
  }

  async getTokens(
    jwtPayload: Partial<JwtPayloadInterface>,
  ): Promise<TokenInterface> {
    return {
      access_token: await this._jwtService.signAsync(jwtPayload, {
        secret: this._configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '24h',
      }),
    };
  }

  async signUp(credentials: SignUpDto): Promise<TokenInterface> {
    const { email, password } = credentials;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const payload: Partial<JwtPayloadInterface> = {
      _id: user._id,
      email,
    };

    return await this.getTokens(payload);
  }

  async signIn(credentials: SignInDto): Promise<TokenInterface> {
    const alreadyExists = await this._userService.findUserByEmail(
      credentials.email,
    );
    if (alreadyExists) {
      throw new BadRequestException('Have you registered before');
    }
    const user = await this._userService.create(credentials);
    const payload: Partial<JwtPayloadInterface> = {
      _id: user._id,
      email: user.email,
    };
    return await this.getTokens(payload);
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this._userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(`${email} is not a valid account.`);
    }

    const reset = await this._userService.getResetPasswordToken(email);
    await this.emailService.sendResetPasswordEmail(user, reset);
    return 'send email';
  }

  async resetPassword(resetPasswordData: ResetPasswordDto) {
    const resetLink = await this._userService.findResetLinkByToken(
      resetPasswordData.resetToken,
    );
    if (!resetLink) {
      throw new BadRequestException(
        'The reset link you provided is not valid.',
      );
    }
    if (!resetLink) {
      throw new BadRequestException('Password reset token has expired.');
    }

    return this._userService.changePassword(
      resetLink.email,
      resetPasswordData.password,
    );
  }
}
