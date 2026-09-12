import { app } from '../backend/src/app.js';
import { connectDB } from '../backend/src/db/connection.js';
import type { Request, Response } from 'express';

let databaseConnection: Promise<void> | null = null;

export default async function handler(req: Request, res: Response) {
  try {
    databaseConnection ??= connectDB();
    await databaseConnection;
    return app(req, res);
  } catch (error) {
    databaseConnection = null;
    console.error('Vercel API initialization failed:', error);
    return res.status(503).json({
      success: false,
      message: 'Database unavailable',
    });
  }
}
