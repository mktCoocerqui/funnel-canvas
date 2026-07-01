import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

function isLocalDatabase(url: string | undefined): boolean {
  if (!url) return true;
  return url.includes('localhost') || url.includes('127.0.0.1');
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    super({
      adapter: new PrismaPg({
        connectionString,
        // Hosted providers (Supabase, Neon, Vercel Postgres...) require SSL;
        // local Postgres for dev usually doesn't support it at all.
        ssl: isLocalDatabase(connectionString) ? undefined : { rejectUnauthorized: false },
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
