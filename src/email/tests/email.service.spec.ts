import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../email.service';
import { EmailType } from '../types/email.type';
import { ConfigService } from '@nestjs/config';

const emailInstance = {
  sendMail: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

jest.mock('nodemailer', () => {
  return { createTransport: jest.fn(() => emailInstance) };
});

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, ConfigService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('testing send email', () => {
    it('should send an email and get a true', async () => {
      const configService: any = {
        get: jest
          .fn()
          .mockReturnValueOnce('service')
          .mockReturnValueOnce('auth.user')
          .mockReturnValueOnce('auth.pass'),
      };
      const emailService = new EmailService(configService);
      const newEmail = await emailService.sendMail(
        EmailType.PasswordReset,
        'thaymerapv@gmail.com',
        {
          name: 'thay',
          passwordResetLink: `http://localhost:3000/auth/reset-password/111111`,
          linkExpireHours: 1,
        },
      );
      expect(newEmail).toBe(true);
    });
  });
});
