import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    }),
  );
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Web Crawler & Snapshots API')
    .setDescription(
      'An API to web crawling and asset harvesting, and to manage snapshots of web pages.',
    )
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  const outputPath = path.resolve('docs/', 'swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' });

  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get('port'));
}
bootstrap();
