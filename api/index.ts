import type { Request, Response } from 'express';
import { app } from '../backend/src/app.js';
import { connectDB } from '../backend/src/db/connection.js';
import { seedDatabase } from '../backend/src/db/seed.js';

let databaseReady: Promise<void> | null = null;

async function ensureDatabase() {
  databaseReady ??= (async () => {
    await connectDB();
    await seedDatabase();
  })();

  try {
    await databaseReady;
  } catch (error) {
    databaseReady = null;
    throw error;
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    await ensureDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Vercel API initialization failed:', error instanceof Error ? error.stack : error);
    return res.status(503).json({
      success: false,
      message: 'API initialization failed. Check the Vercel MONGODB_URI environment variable and database connectivity.',
    });
  }
}
