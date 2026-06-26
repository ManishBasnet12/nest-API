// prisma.config.ts
import 'dotenv/config'; // Explicitly loads the .env file for the Prisma CLI
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'), // Type-safe macro evaluation for migrations/cli
  },
});