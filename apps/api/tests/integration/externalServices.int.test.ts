import { describe, it, expect } from 'vitest';
import { ApiIntegrationService } from '../../src/services/apiIntegration.service.js';

const shouldRun = process.env.RUN_EXTERNAL_INTEGRATION_TESTS === '1';
const hasGemini = !!process.env.GEMINI_API_KEY;
const hasGcp = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
const hasS3 = !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY && !!process.env.AWS_REGION && !!process.env.AWS_S3_BUCKET_NAME;

describe('Integration: External Services (opt-in; skips when credentials missing)', () => {
  it.skipIf(!shouldRun || !hasGemini)('Gemini generateText should succeed', async () => {
    const api = new ApiIntegrationService();
    const text = await api.generateText('Say "Ciao" in Italian');
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  it.skipIf(!shouldRun || !hasGcp)('Google TTS synthesize should return audio buffer', async () => {
    const api = new ApiIntegrationService();
    const audio = await api.synthesizeItalian('Ciao, questo è un test');
    expect(Buffer.isBuffer(audio)).toBe(true);
    expect(audio.length).toBeGreaterThan(0);
  });

  it.skipIf(!shouldRun || !hasS3)('S3 upload should succeed', async () => {
    const api = new ApiIntegrationService();
    const dummy = Buffer.from('test');
    await api.uploadAudio(`integration-test-${Date.now()}`, dummy);
    expect(true).toBe(true);
  });
});

