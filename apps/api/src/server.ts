import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import modelRoutes from './routes/model.routes.js';
import contentRoutes from './routes/content.routes.js';
import { validateAndLogCredentials } from './utils/credentialValidator.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[Server] ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
});

// Health check routes
app.use('/health', healthRoutes);

// Model service routes
app.use('/api/model', modelRoutes);

// Content generation routes
app.use('/api/content', contentRoutes);

// Error handling middleware (must be last)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server] Unhandled error:', err);
  console.error('[Server] Error stack:', err.stack);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    },
  });
});

// Validate external service credentials on startup
console.log('[Server] Validating credentials...');
try {
  validateAndLogCredentials();
  console.log('[Server] Credentials validated');
} catch (error) {
  console.error('[Server] Credential validation failed:', error);
}

app.listen(PORT, () => {
  console.log(`[Server] Server running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});
