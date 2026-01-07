import { ApiClientError, HealthCheckResult, classifyStatusToErrorType } from '../utils/errors.js';
import { globalRateLimitTracker } from '../utils/rateLimitTracker.js';
import { request as undiciRequest } from 'undici';

interface GenerateTextParams {
  prompt: string;
  model?: string;
}

export class GeminiClientService {
  private readonly apiKey: string | undefined;
  private readonly baseUrl = 'https://generativelanguage.googleapis.com';
  private readonly defaultModel = 'gemini-2.5-flash';
  private availableModel: string | null = null;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  /**
   * List available models from Gemini API and find one that supports generateContent
   */
  async listAvailableModels(): Promise<string> {
    if (!this.apiKey) {
      throw new ApiClientError({
        message: 'GEMINI_API_KEY is not configured',
        type: 'AuthenticationError',
        service: 'gemini',
      });
    }

    const url = `${this.baseUrl}/v1beta/models?key=${this.apiKey}`;
    
    try {
      const { statusCode, body } = await undiciRequest(url, { method: 'GET' });
      
      if (statusCode < 200 || statusCode >= 300) {
        throw new ApiClientError({
          message: `Failed to list models: HTTP ${statusCode}`,
          type: 'ApiError',
          service: 'gemini',
          statusCode,
        });
      }

      const json = (await body.json()) as any;
      const models = json?.models || [];
      
      // Find a model that supports generateContent
      for (const model of models) {
        const modelName = model.name?.replace('models/', '');
        const supportedMethods = model.supportedGenerationMethods || [];
        
        if (modelName && supportedMethods.includes('generateContent')) {
          console.log(`[GeminiClientService] Found available model: ${modelName}`);
          this.availableModel = modelName;
          return modelName;
        }
      }
      
      // Fallback: try common model names
      const fallbackModels = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-pro'];
      console.warn(`[GeminiClientService] No model found in ListModels response, trying fallback models`);
      return fallbackModels[0];
    } catch (err) {
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError({
        message: 'Failed to list available models',
        type: 'NetworkError',
        service: 'gemini',
        cause: err,
      });
    }
  }

  async healthCheck(): Promise<HealthCheckResult> {
    try {
      if (!this.apiKey) {
        return {
          service: 'gemini',
          healthy: false,
          details: 'Missing GEMINI_API_KEY',
          errorType: 'AuthenticationError',
        };
      }
      const url = `${this.baseUrl}/v1beta/models?key=${this.apiKey}`;
      const { statusCode } = await undiciRequest(url, { method: 'GET' });
      const ok = statusCode >= 200 && statusCode < 300;
      return {
        service: 'gemini',
        healthy: ok,
        details: ok ? 'OK' : `HTTP ${statusCode}`,
        errorType: ok ? undefined : classifyStatusToErrorType(statusCode),
      };
    } catch (err) {
      return {
        service: 'gemini',
        healthy: false,
        details: err instanceof Error ? err.message : String(err),
        errorType: 'NetworkError',
      };
    }
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    if (!this.apiKey) {
      throw new ApiClientError({
        message: 'GEMINI_API_KEY is not configured',
        type: 'AuthenticationError',
        service: 'gemini',
      });
    }
    const model = params.model ?? this.defaultModel;
    const url = `${this.baseUrl}/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    globalRateLimitTracker.increment('gemini');

    try {
      const { statusCode, body } = await undiciRequest(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: params.prompt }]}],
        }),
      });

      if (statusCode < 200 || statusCode >= 300) {
        let errorBodyText: string | undefined;
        try {
          // undici body supports .text(); if parsing fails, ignore
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errorBodyText = await (body as any).text?.();
        } catch {
          errorBodyText = undefined;
        }

        const errorType = classifyStatusToErrorType(statusCode);
        throw new ApiClientError({
          message: `Gemini API responded with status ${statusCode}`,
          type: errorType,
          service: 'gemini',
          statusCode,
          causeMessage: errorBodyText ? errorBodyText.slice(0, 1000) : undefined,
        });
      }

      const json = (await body.json()) as any;
      const text =
        json?.candidates?.[0]?.content?.parts?.[0]?.text ??
        json?.candidates?.[0]?.content?.parts?.[0]?.content ??
        '';
      if (!text) {
        throw new ApiClientError({
          message: 'Empty content returned by Gemini',
          type: 'ApiError',
          service: 'gemini',
        });
      }
      return String(text);
    } catch (err) {
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError({
        message: 'Failed to call Gemini API',
        type: 'NetworkError',
        service: 'gemini',
        cause: err,
      });
    }
  }
}

