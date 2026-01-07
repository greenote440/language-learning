import { describe, it, expect } from 'vitest';
import { ApiIntegrationService } from '../../src/services/apiIntegration.service.js';

describe('ApiIntegrationService', () => {
  it('getAvailableServices should reflect missing environment variables', () => {
    const prev = {
      gemini: process.env.GEMINI_API_KEY,
      gcp: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      id: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_S3_BUCKET_NAME,
    };
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.AWS_REGION;
    delete process.env.AWS_S3_BUCKET_NAME;

    const svc = new ApiIntegrationService();
    const available = svc.getAvailableServices();
    expect(available.length).toBe(0);

    if (prev.gemini) process.env.GEMINI_API_KEY = prev.gemini;
    if (prev.gcp) process.env.GOOGLE_APPLICATION_CREDENTIALS = prev.gcp;
    if (prev.id) process.env.AWS_ACCESS_KEY_ID = prev.id;
    if (prev.secret) process.env.AWS_SECRET_ACCESS_KEY = prev.secret;
    if (prev.region) process.env.AWS_REGION = prev.region;
    if (prev.bucket) process.env.AWS_S3_BUCKET_NAME = prev.bucket;
  });
});

