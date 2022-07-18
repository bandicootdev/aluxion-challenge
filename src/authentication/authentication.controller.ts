import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenInterface } from './interfaces/token.interface';
import { ForgotPasswordDto } from '../user/dtos/forgot-password.dto';
import { ResetPasswordDto } from '../user/dtos/reset-pasword.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { TokenDto } from './dtos/token.dto';
import { ErrorResponseDto } from '../common/dtos/error-response.dto';

@ApiTags('Authentication Management')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly _authenticationService: AuthenticationService) {}

  @Post('/sign-in')
  @Serialize(TokenDto)
  @ApiOkResponse({ type: () => TokenDto })
  @ApiOperation({ description: 'register a new user :)' })
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  signIn(@Body() credentials: SignInDto): Promise<TokenInterface> {
    return this._authenticationService.signIn(credentials);
  }

  @Post('/sign-up')
  @Serialize(TokenDto)
  @ApiOkResponse({ type: () => TokenDto })
  @ApiOperation({ description: 'log in with a previously created user' })
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  signUp(@Body() credentials: SignUpDto): Promise<TokenInterface> {
    return this._authenticationService.signUp(credentials);
  }

  @Get('google')
  // @ApiOAuth2()
  @ApiOperation({ description: 'sign in with a google user' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @ApiOperation({
    description: 'sign in with a google user continued verification',
  })
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this._authenticationService.googleLogin(req);
  }

  @Post('forgot-password')
  @ApiOkResponse({ type: String })
  @ApiOperation({ description: 'Password recovery' })
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this._authenticationService.forgotPassword(body.email);
  }

  @Get('reset-password/:id')
  @ApiOperation({ description: 'Get password recovery token' })
  @ApiOkResponse({
    type: () => ({
      ok: Boolean,
      message: String,
      token: String,
    }),
  })
  resetPasswordObtained(@Param('id') id: string) {
    return {
      ok: true,
      message: `Please copy this id you got from the email, and go to POST path reset-password this would be a bit more intuitive with the front.`,
      token: id,
    };
  }

  @Post('reset-password')
  @ApiOperation({ description: 'Change password via recovery link' })
  @ApiOkResponse({
    type: () => ({
      success: Boolean,
    }),
  })
  @ApiBadRequestResponse({ type: () => ErrorResponseDto })
  @ApiInternalServerErrorResponse({ type: () => ErrorResponseDto })
  resetPassword(@Body() body: ResetPasswordDto) {
    return this._authenticationService.resetPassword(body);
  }

  /*
   * esta ruta es solo para un test de verificar el usuario logueado :)
   * */
  // @Get('none')
  // @UseGuards(JwtAuthGuard)
  // getCurrentUser(@Req() req: Request) {
  //   console.log(req['user']);
  //   return {
  //     user: req['user'],
  //   };
  // }
}
