import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Prevent multiple instances in development/serverless hot-reloads
const globalForPrisma = global as unknown as { prisma: PrismaClient };

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    if (globalForPrisma.prisma) {
      // If an instance already exists, copy internal configuration
      super({} as any);
      return globalForPrisma.prisma as any;
    }

    const connectionString = process.env.DATABASE_URL;
    const poolOptions: any = {
      connectionString,
      max: parseInt(process.env.DB_POOL_SIZE || '2', 10), // Low pool size for serverless
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '15000', 10),
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

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = this;
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}