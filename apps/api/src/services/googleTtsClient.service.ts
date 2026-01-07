import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { ApiClientError, HealthCheckResult } from '../utils/errors.js';
import { globalRateLimitTracker } from '../utils/rateLimitTracker.js';
import * as path from 'path';
import * as fs from 'fs';

export class GoogleTtsClientService {
  private createClient(): TextToSpeechClient {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!keyPath) {
      throw new ApiClientError({
        message: 'GOOGLE_APPLICATION_CREDENTIALS is not configured',
        type: 'AuthenticationError',
        service: 'googleTts',
      });
    }
    const resolved = path.isAbsolute(keyPath)
      ? keyPath
      : path.resolve(process.cwd(), keyPath);
    if (!fs.existsSync(resolved)) {
      throw new ApiClientError({
        message: `Google credentials file not found at ${resolved}`,
        type: 'AuthenticationError',
        service: 'googleTts',
      });
    }
    return new TextToSpeechClient({ keyFilename: resolved });
  }

  async healthCheck(): Promise<HealthCheckResult> {
    try {
      // Lightweight request: list voices for it-IT
      const client = this.createClient();
      const [result] = await client.listVoices({ languageCode: 'it-IT' });
      const ok = Array.isArray(result.voices) && result.voices.length > 0;
      return {
        service: 'googleTts',
        healthy: ok,
        details: ok ? 'OK' : 'No voices returned',
      };
    } catch (err) {
      if (err instanceof ApiClientError) {
        return {
          service: 'googleTts',
          healthy: false,
          details: err.message,
          errorType: err.type,
        };
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        const isAuth = msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('auth') || msg.toLowerCase().includes('credentials');
        return {
          service: 'googleTts',
          healthy: false,
          details: msg,
          errorType: isAuth ? 'AuthenticationError' : 'NetworkError',
        };
      }
    }
  }

  async synthesize(text: string, voiceName = 'it-IT-Wavenet-A'): Promise<Buffer> {
    const client = this.createClient();
    globalRateLimitTracker.increment('googleTts');
    try {
      const [response] = await client.synthesizeSpeech({
        input: { text },
        voice: { languageCode: 'it-IT', name: voiceName },
        audioConfig: { audioEncoding: 'MP3' },
      });
      if (!response.audioContent) {
        throw new ApiClientError({
          message: 'No audioContent in TTS response',
          type: 'ApiError',
          service: 'googleTts',
        });
      }
      return Buffer.from(response.audioContent as Uint8Array);
    } catch (err) {
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError({
        message: 'Failed to synthesize speech',
        type: 'NetworkError',
        service: 'googleTts',
        cause: err,
      });
    }
  }
}

