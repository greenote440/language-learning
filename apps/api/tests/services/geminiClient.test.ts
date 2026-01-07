import { describe, it, expect } from 'vitest';
import { GeminiClientService } from '../../src/services/geminiClient.service.js';

describe('GeminiClientService', () => {
  it('healthCheck should report unhealthy when GEMINI_API_KEY is missing', async () => {
    const previous = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    const svc = new GeminiClientService();
    const res = await svc.healthCheck();
    expect(res.healthy).toBe(false);
    expect(res.errorType).toBe('AuthenticationError');
    if (previous) process.env.GEMINI_API_KEY = previous;
  });
});

