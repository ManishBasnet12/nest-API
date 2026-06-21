import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const poolOptions: any = {
      connectionString,
      max: parseInt(process.env.DB_POOL_SIZE || '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    };
    if (process.env.DB_PASSWORD) {
      poolOptions.password = String(process.env.DB_PASSWORD);
    }
    const pool = new Pool(poolOptions);
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: ['error', 'warn'],
    } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
