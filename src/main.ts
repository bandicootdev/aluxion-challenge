import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configDocuments = new DocumentBuilder()
    .setTitle('Aluxion Api')
    .setDescription('The Aluxion Challenge API description')
    .setVersion('1.0')
    .addTag('Aluxion Labs')
    .addBearerAuth()
    .addOAuth2({
      type: 'oauth2',
      // flows: {
      //   implicit: {
      //     tokenUrl: `${teanat}/oauth/token`,
      //     authorizationUrl: `${teanat}/authorize?audience=${`${teanat}/api/v2/`}&nonce=${nonce}`,
      //     scopes: {}, // { openid: openid, ... }
      //   },
      // },
    })
    .build();
  const document = SwaggerModule.createDocument(app, configDocuments);
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: 'http://localhost:4200/auth/google/callback',
      oauth: {
        clientId: 'CLIENT_ID',
      },
    },
  });
  app.use(compression());
  app.enableCors();
  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });
  await app.listen(3000);
}
bootstrap();
