import { S3Client, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ApiClientError, HealthCheckResult } from '../utils/errors.js';
import { globalRateLimitTracker } from '../utils/rateLimitTracker.js';

export class S3ClientService {
  private static formatAwsSdkError(err: unknown): string {
    if (!(err instanceof Error)) return String(err);
    const anyErr = err as any;
    const meta = anyErr?.$metadata
      ? {
          httpStatusCode: anyErr.$metadata.httpStatusCode,
          requestId: anyErr.$metadata.requestId,
          extendedRequestId: anyErr.$metadata.extendedRequestId,
          cfId: anyErr.$metadata.cfId,
        }
      : undefined;
    return JSON.stringify(
      {
        name: anyErr?.name ?? err.name,
        message: err.message,
        code: anyErr?.Code ?? anyErr?.code,
        bucketRegion: anyErr?.BucketRegion ?? anyErr?.bucketRegion,
        metadata: meta,
      },
      null,
      2,
    );
  }

  private getConfig() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    if (!accessKeyId || !secretAccessKey || !region || !bucket) {
      const missing: string[] = [];
      if (!accessKeyId) missing.push('AWS_ACCESS_KEY_ID');
      if (!secretAccessKey) missing.push('AWS_SECRET_ACCESS_KEY');
      if (!region) missing.push('AWS_REGION');
      if (!bucket) missing.push('AWS_S3_BUCKET_NAME');
      throw new ApiClientError({
        message: `Missing S3 environment variables: ${missing.join(', ')}`,
        type: 'AuthenticationError',
        service: 's3',
      });
    }
    return { accessKeyId, secretAccessKey, region, bucket };
  }

  private createClient(): S3Client {
    const { accessKeyId, secretAccessKey, region } = this.getConfig();
    return new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const { bucket } = this.getConfig();
      const client = this.createClient();
      const head = new HeadBucketCommand({ Bucket: bucket });
      await client.send(head);
      return { service: 's3', healthy: true, details: 'OK' };
    } catch (err) {
      if (err instanceof ApiClientError) {
        return {
          service: 's3',
          healthy: false,
          details: err.message,
          errorType: err.type,
        };
      }
      return {
        service: 's3',
        healthy: false,
        details: S3ClientService.formatAwsSdkError(err),
        errorType: 'NetworkError',
      };
    }
  }

  async uploadObject(key: string, body: Buffer | Uint8Array | string, contentType = 'application/octet-stream'): Promise<void> {
    const { bucket } = this.getConfig();
    const client = this.createClient();
    globalRateLimitTracker.increment('s3');
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
    } catch (err) {
      throw new ApiClientError({
        message: 'Failed to upload object to S3',
        type: 'NetworkError',
        service: 's3',
        cause: S3ClientService.formatAwsSdkError(err),
      });
    }
  }
}

