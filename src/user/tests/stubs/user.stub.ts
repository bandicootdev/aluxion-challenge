import { CreateUserDto } from '../../dtos/create-user.dto';
import { CreateUserFromGoogleDto } from '../../dtos/create-user-from-google.dto';

export const userStub = (): CreateUserDto => {
  return {
    firstname: 'thay',
    email: 'thaymerapv@gmail.com',
    password: '123456',
  };
};

export const userGoogleStub = (): CreateUserFromGoogleDto => {
  return {
    firstName: 'thay',
    email: 'thaymerapv1@gmail.com',
  };
};
