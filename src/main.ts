import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    //Permitir accesos
    origin: ['http://localhost:3000'], //Origen de peticion
    methods: ['GET', 'POST', 'DELETE', 'PATCH'], //Metodos que debe aceptar
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = 3001;

  await app.listen(port);

  console.log('Aplicación corriendo en el puerto: ', port);
}
bootstrap();
