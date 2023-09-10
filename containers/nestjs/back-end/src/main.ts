import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { EventEmitter } from 'stream';

process.setMaxListeners(0);
const emitter = new EventEmitter();
emitter.setMaxListeners(0);


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(
    session({
      name: 'yassir cookie',
      secret: 'yassirbloto',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 },
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(helmet());
  // app.use(passport.initialize());
  // app.use(passport.session());
  passport.session();
  await app.listen(8000);
}

bootstrap();
