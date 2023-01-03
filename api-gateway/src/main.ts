import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();

  //Swagger SetUp
  const config = new DocumentBuilder()
      .setTitle('Webudding Seller MSA Test API')
      .setDescription('Seller MSA Test API')
      .setVersion('1.0.0')
      .addBearerAuth(
          {
              type: 'http',
              scheme: 'bearer',
              name: 'JWT',
              description: 'Enter JWT token',
              in: 'header',
          },
          'seller-msa-test',
      )
      .build();
  const document = SwaggerModule.createDocument(app, config, {
      include: [AppModule],
      deepScanRoutes: true,
      ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('/swagger', app, document);


  await app.listen(3000);
}
bootstrap();
