import { describe, it, expect } from 'vitest';
import { GoogleTtsClientService } from '../../src/services/googleTtsClient.service.js';

describe('GoogleTtsClientService', () => {
  it('healthCheck should report unhealthy when GOOGLE_APPLICATION_CREDENTIALS is missing', async () => {
    const previous = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const svc = new GoogleTtsClientService();
    const res = await svc.healthCheck();
    expect(res.healthy).toBe(false);
    expect(res.errorType).toBe('AuthenticationError');
    if (previous) process.env.GOOGLE_APPLICATION_CREDENTIALS = previous;
  });
});

