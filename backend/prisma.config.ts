import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // The CLI (migrate/introspect) needs a direct, non-pooled connection.
    // The running app uses DATABASE_URL (which may be pooled) separately,
    // via PrismaService's @prisma/adapter-pg instance — see prisma.service.ts.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
