import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/error/allException.filter';
import { LoggingInterceptor } from './common/api-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  const port = process.env.PORT || 3000;

  app.setGlobalPrefix('eco');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost), new ConsoleLogger()));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Eco Billiards')
    .setDescription(' API SERVER')
    .setVersion('v1.0')
    .addTag('Eco Billiards')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('eco/swagger', app, document);

  logger.verbose('====================================');
  logger.verbose(`==== SERVER IS RUNNING ON ${port} =====`);
  logger.verbose('====================================');
  await app.listen(port);
}

bootstrap();
