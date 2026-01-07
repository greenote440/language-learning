import { describe, it, expect } from 'vitest';
import { S3ClientService } from '../../src/services/s3Client.service.js';

describe('S3ClientService', () => {
  it('healthCheck should report unhealthy when AWS env vars are missing', async () => {
    const prev = {
      id: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_S3_BUCKET_NAME,
    };
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.AWS_REGION;
    delete process.env.AWS_S3_BUCKET_NAME;
    const svc = new S3ClientService();
    const res = await svc.healthCheck();
    expect(res.healthy).toBe(false);
    if (prev.id) process.env.AWS_ACCESS_KEY_ID = prev.id;
    if (prev.secret) process.env.AWS_SECRET_ACCESS_KEY = prev.secret;
    if (prev.region) process.env.AWS_REGION = prev.region;
    if (prev.bucket) process.env.AWS_S3_BUCKET_NAME = prev.bucket;
  });
});

