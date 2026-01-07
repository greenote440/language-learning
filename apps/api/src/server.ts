import 'dotenv/config';
import express from 'express';
import healthRoutes from './routes/health.routes.js';
import modelRoutes from './routes/model.routes.js';
import { validateAndLogCredentials } from './utils/credentialValidator.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check routes
app.use('/health', healthRoutes);

// Model service routes
app.use('/api/model', modelRoutes);

// Validate external service credentials on startup
validateAndLogCredentials();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
