import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load .env from repo root for local test runs.
// In CI, secrets should be provided via environment variables; missing credentials will still cause integration tests to skip.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');
config({ path: path.join(projectRoot, '.env') });

