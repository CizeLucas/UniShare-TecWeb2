/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { QueryEvent } from '../generated/prisma/internal/prismaNamespace';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    const pool = new Pool({
      connectionString: process.env['DATABASE_URL'],
    });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: [
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
        {
          // Log queries and infos only in development
          emit: 'event' as const,
          level: 'query' as const,
        },
        { emit: 'stdout' as const, level: 'info' as const },
      ],
    });
  }

  async onModuleInit() {
    // Listen for query events only in development
    this.$on('query' as never, (e: QueryEvent) => {
      this.logger.debug(`Query: ${e.query}`);
      this.logger.debug(`Params: ${JSON.stringify(e.params)}`);
      this.logger.debug(`Duration: ${e.duration}ms\n`);
    });

    try {
      await this.$connect();
      this.logger.log('Successfully connected to the database.');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error);
      throw error;
    }
  }
}
