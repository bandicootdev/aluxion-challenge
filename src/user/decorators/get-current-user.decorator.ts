import { JwtPayloadInterface } from '../../authentication/interfaces/jwt-payload.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type JwtPayloadToken = JwtPayloadInterface;

export const GetCurrentUserDecorator = createParamDecorator(
  (data: keyof JwtPayloadToken, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
