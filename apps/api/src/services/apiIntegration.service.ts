import { GeminiClientService } from './geminiClient.service.js';
import { GoogleTtsClientService } from './googleTtsClient.service.js';
import { S3ClientService } from './s3Client.service.js';
import { ApiClientError, HealthCheckResult } from '../utils/errors.js';

export interface AggregateHealth {
  gemini: HealthCheckResult;
  googleTts: HealthCheckResult;
  s3: HealthCheckResult;
  allHealthy: boolean;
}

export class ApiIntegrationService {
  private readonly gemini = new GeminiClientService();
  private readonly googleTts = new GoogleTtsClientService();
  private readonly s3 = new S3ClientService();

  async healthCheckAll(): Promise<AggregateHealth> {
    const [gemini, googleTts, s3] = await Promise.all([
      this.gemini.healthCheck(),
      this.googleTts.healthCheck(),
      this.s3.healthCheck(),
    ]);
    return {
      gemini,
      googleTts,
      s3,
      allHealthy: gemini.healthy && googleTts.healthy && s3.healthy,
    };
  }

  getAvailableServices(): Array<'gemini' | 'googleTts' | 's3'> {
    const available: Array<'gemini' | 'googleTts' | 's3'> = [];
    if (process.env.GEMINI_API_KEY) available.push('gemini');
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) available.push('googleTts');
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION && process.env.AWS_S3_BUCKET_NAME) {
      available.push('s3');
    }
    return available;
  }

  async generateText(prompt: string): Promise<string> {
    return this.gemini.generateText({ prompt });
  }

  async synthesizeItalian(text: string): Promise<Buffer> {
    return this.googleTts.synthesize(text);
  }

  async uploadAudio(contentId: string, audio: Buffer): Promise<void> {
    const key = `audio/${contentId}.mp3`;
    await this.s3.uploadObject(key, audio, 'audio/mpeg');
  }

  // Generic wrapper to standardize error handling for any async call
  async withStandardErrors<T>(service: string, fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError({
        message: 'Operation failed',
        type: 'NetworkError',
        service,
        cause: err,
      });
    }
  }
}

