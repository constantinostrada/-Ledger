import { Pool, PoolConfig } from 'pg';

export class DatabaseClient {
  private static instance: Pool;

  static getInstance(): Pool {
    if (!DatabaseClient.instance) {
      const config: PoolConfig = {
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };

      DatabaseClient.instance = new Pool(config);
    }

    return DatabaseClient.instance;
  }

  static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.end();
    }
  }
}
