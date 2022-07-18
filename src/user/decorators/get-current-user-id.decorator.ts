import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadInterface } from '../../authentication/interfaces/jwt-payload.interface';

export const GetCurrentUserIdDecorator = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayloadInterface;
    return user._id;
  },
);
