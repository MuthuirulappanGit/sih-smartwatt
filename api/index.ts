import type { Request, Response } from 'express';

let databaseConnection: Promise<void> | null = null;

export default async function handler(req: Request, res: Response) {
  try {
    const [{ app }, { connectDB }] = await Promise.all([
      import('../backend/src/app.js'),
      import('../backend/src/db/connection.js'),
    ]);

    databaseConnection ??= connectDB();
    await databaseConnection;
    return app(req, res);
  } catch (error) {
    databaseConnection = null;
    console.error('Vercel API initialization failed:', error instanceof Error ? error.stack : error);
    return res.status(503).json({
      success: false,
      message: 'API initialization failed',
    });
  }
}
