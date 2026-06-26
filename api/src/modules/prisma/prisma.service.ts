// src/modules/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client'; // Maps to your schema output directory
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    if (globalForPrisma.prisma) {
      // Pass an empty config argument to satisfy the base constructor before returning early
      super({} as any);
      return globalForPrisma.prisma as any;
    }

    const connectionString = process.env.DATABASE_URL;
    const poolOptions: any = {
      connectionString,
      // Small footprint pooling configuration vital for Vercel/Serverless lambda limitations
      max: parseInt(process.env.DB_POOL_SIZE || '2', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '15000', 10),
    };
    
    if (process.env.DB_PASSWORD) {
      poolOptions.password = String(process.env.DB_PASSWORD);
    }
    
    const pool = new Pool(poolOptions);
    const adapter = new PrismaPg(pool);

    // Initializing standard driver configurations inside the options argument
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