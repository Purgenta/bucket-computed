import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Iot readings API')
    .setDescription('The Iot readings API description')
    .setVersion('1.0')
    .addTag('iotreadings')
    .build();

    app.enableCors({ origin: ['http://127.0.0.1:5173','http://localhost:5173'], credentials: true });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
