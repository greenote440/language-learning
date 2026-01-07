type ServiceKey = 'gemini' | 'googleTts' | 's3';

export interface RateWindowConfig {
  windowMs: number;
}

export interface UsageCounters {
  count: number;
  lastResetAt: number;
}

export interface RateLimitStatus {
  service: ServiceKey;
  countInWindow: number;
  windowMs: number;
  windowStartedAt: number;
}

export class RateLimitTracker {
  private readonly windowMs: number;
  private readonly counters: Record<ServiceKey, UsageCounters>;

  constructor(config?: Partial<RateWindowConfig>) {
    this.windowMs = config?.windowMs ?? 60_000;
    const now = Date.now();
    this.counters = {
      gemini: { count: 0, lastResetAt: now },
      googleTts: { count: 0, lastResetAt: now },
      s3: { count: 0, lastResetAt: now },
    };
  }

  increment(service: ServiceKey): void {
    const now = Date.now();
    const entry = this.counters[service];
    if (now - entry.lastResetAt >= this.windowMs) {
      entry.count = 0;
      entry.lastResetAt = now;
    }
    entry.count += 1;
  }

  getStatus(service: ServiceKey): RateLimitStatus {
    const now = Date.now();
    const entry = this.counters[service];
    if (now - entry.lastResetAt >= this.windowMs) {
      entry.count = 0;
      entry.lastResetAt = now;
    }
    return {
      service,
      countInWindow: entry.count,
      windowMs: this.windowMs,
      windowStartedAt: entry.lastResetAt,
    };
  }
}

export const globalRateLimitTracker = new RateLimitTracker();

