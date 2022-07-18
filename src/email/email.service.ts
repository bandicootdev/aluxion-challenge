import { Injectable } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { EmailType } from './types/email.type';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendResetPasswordEmail(
    user: User,
    resetToken: string,
  ): Promise<boolean> {
    return this.sendMail(EmailType.PasswordReset, user.email, {
      name: user.firstname,
      passwordResetLink: `http://localhost:3000/auth/reset-password/${resetToken}`,
      linkExpireHours: 1,
    });
  }

  async sendMail(
    code: EmailType,
    recipient: string,
    substitutes: any,
  ): Promise<boolean> {
    await this.nodemailerTransport.sendMail({
      to: recipient,
      from: 'thaymerapv@gmail.com',
      subject: `Hello ${substitutes.name}`,
      html: `<p>To change your password please access this link:</p> <br> 
                <a href="${substitutes.passwordResetLink}">Click here! </a> <br>
            <strong>this email expires in ${substitutes.linkExpireHours} hour. </strong> `,
    });
    return true;
  }
}
