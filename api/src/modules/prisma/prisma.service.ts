// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static instance: PrismaService;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // For serverless, use connection pooling
    const pool = new Pool({
      connectionString,
      max: parseInt(process.env.DB_POOL_SIZE || '1', 10), // Lower for serverless
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '3000', 10),
      connectionTimeoutMillis: 5000,
    });

    const adapter = new PrismaPg(pool);
    super({ 
      adapter, 
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'info'] : ['error'] 
    } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}