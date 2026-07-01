import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express } from 'express';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../backend/src/app.module';

// Reused across warm invocations of this serverless function so we don't
// re-bootstrap the whole Nest app (and DB connection pool) on every request.
let expressAppPromise: Promise<Express> | null = null;

async function bootstrap(): Promise<Express> {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  await app.init();
  return expressApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!expressAppPromise) expressAppPromise = bootstrap();
  const expressApp = await expressAppPromise;
  expressApp(req, res);
}
