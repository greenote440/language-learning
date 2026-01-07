import 'dotenv/config';
import express from 'express';
import healthRoutes from './routes/health.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check routes
app.use('/health', healthRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
