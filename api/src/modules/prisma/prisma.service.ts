import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const pool = new Pool({
      connectionString,
      max: parseInt(process.env.DB_POOL_SIZE || '5', 10), // keep low for serverless
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '10000', 10),
    });

    const adapter = new PrismaPg(pool);
    super({ adapter, log: ['error', 'warn'] } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
