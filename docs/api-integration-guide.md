# API Integration Guide

This guide explains how to configure and validate external API integrations used by the backend (`apps/api`).

## Services

- Gemini API (Google AI) — text generation
- Google Cloud Text-to-Speech — audio synthesis (Italian)
- AWS S3 — audio file storage

## Prerequisites

Configure environment variables in your root `.env`:

```
GEMINI_API_KEY=...
GOOGLE_APPLICATION_CREDENTIALS=relative/or/absolute/path/to/service-account.json
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket
```

Notes:
- `GOOGLE_APPLICATION_CREDENTIALS` can be relative to the repository root.
- Never commit credentials. Use local `.env` or platform secrets.

## Validation

1) Startup validation (non-blocking):
   - The API server logs missing credentials using `validateAndLogCredentials()`.

2) Manual validation:
   - Run `pnpm --filter @adaptive-italian-audio/api test:external`
   - This tests Gemini, Google TTS, and S3 connectivity with small sample requests.

3) Automated tests:
   - Unit tests mock network calls: `pnpm --filter @adaptive-italian-audio/api test`
   - Integration tests are opt-in and skip when credentials are missing:
     - Run with `RUN_EXTERNAL_INTEGRATION_TESTS=1 pnpm --filter @adaptive-italian-audio/api test`

## Usage

Service layer entry points:
- `GeminiClientService.generateText(prompt)`
- `GoogleTtsClientService.synthesize(text)`
- `S3ClientService.uploadObject(key, buffer, contentType)`
- `ApiIntegrationService` aggregates health checks and provides convenience methods.

## Troubleshooting

- Authentication:
  - Gemini: Ensure `GEMINI_API_KEY` is correct and active.
  - Google TTS: Verify `GOOGLE_APPLICATION_CREDENTIALS` points to a readable JSON key.
  - AWS S3: Check IAM permissions for `HeadBucket` and `PutObject`.

- Rate limits:
  - The code includes basic per-service counters and exponential backoff patterns can be added where needed.

- Network:
  - Corporate/VPN firewalls can block external requests. Try from a different network.

- AWS S3 (HTTP 301 / PermanentRedirect):
  - This usually means **bucket region mismatch**.
  - Ensure `AWS_REGION` matches the bucket’s actual region in AWS Console, then re-run `pnpm --filter @adaptive-italian-audio/api test:external`.

## References

- Gemini: https://ai.google.dev/gemini-api/docs
- Google Cloud TTS: https://cloud.google.com/text-to-speech/docs
- AWS S3: https://docs.aws.amazon.com/s3/

