import { NextResponse } from 'next/server';
import { DatabaseClient } from '@infrastructure/database/client';

export async function GET() {
  try {
    const pool = DatabaseClient.getInstance();
    await pool.query('SELECT 1');

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
