export type ApiErrorType = 'NetworkError' | 'AuthenticationError' | 'RateLimitError' | 'ApiError';

export class ApiClientError extends Error {
  public readonly type: ApiErrorType;
  public readonly service: string;
  public readonly statusCode?: number;
  public readonly causeMessage?: string;

  constructor(options: {
    message: string;
    type: ApiErrorType;
    service: string;
    statusCode?: number;
    cause?: unknown;
  }) {
    super(options.message);
    this.name = 'ApiClientError';
    this.type = options.type;
    this.service = options.service;
    this.statusCode = options.statusCode;
    if (options.cause instanceof Error) {
      this.causeMessage = options.cause.message;
    } else if (options.cause != null) {
      this.causeMessage = String(options.cause);
    }
  }
}

export interface HealthCheckResult {
  service: string;
  healthy: boolean;
  details?: string;
  errorType?: ApiErrorType;
}

export function classifyStatusToErrorType(statusCode: number): ApiErrorType {
  if (statusCode === 401 || statusCode === 403) {
    return 'AuthenticationError';
  }
  if (statusCode === 429) {
    return 'RateLimitError';
  }
  if (statusCode >= 500) {
    return 'NetworkError';
  }
  return 'ApiError';
}

