import { Router } from 'express';
import { testConnection } from '../config/database.js';

const router = Router();

/**
 * General health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Database health check endpoint
 */
router.get('/db', async (req, res) => {
  try {
    const isConnected = await testConnection();

    if (isConnected) {
      res.json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        message: 'Database connection failed',
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'error',
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
