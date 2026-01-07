/**
 * Test script to verify external service credentials are working
 * Tests: Gemini API, Google Cloud TTS, AWS S3
 */

import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root (3 levels up from this file: apps/api/src/scripts/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');
config({ path: path.join(projectRoot, '.env') });
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  service: string;
  success: boolean;
  message: string;
  error?: string;
}

const results: TestResult[] = [];

/**
 * Test Gemini API
 */
async function testGeminiAPI(): Promise<TestResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      service: 'Gemini API',
      success: false,
      message: 'GEMINI_API_KEY not found in environment variables',
    };
  }

  try {
    // First, list available models to find one that works
    const listResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    let modelName = 'gemini-1.5-pro';
    
    if (listResponse.ok) {
      const modelsData = await listResponse.json();
      // Find first gemini model that supports generateContent
      const availableModel = modelsData.models?.find((m: any) => 
        m.name?.includes('gemini') && 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      if (availableModel) {
        modelName = availableModel.name?.replace('models/', '') || 'gemini-1.5-pro';
      }
    }

    // Try the model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Say "Ciao" in Italian',
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        service: 'Gemini API',
        success: false,
        message: `API call failed with status ${response.status}`,
        error: errorText,
      };
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts) {
      return {
        service: 'Gemini API',
        success: true,
        message: `✅ Successfully generated content: "${data.candidates[0].content.parts[0].text}"`,
      };
    }

    return {
      service: 'Gemini API',
      success: false,
      message: 'Unexpected response format',
      error: JSON.stringify(data),
    };
  } catch (error) {
    return {
      service: 'Gemini API',
      success: false,
      message: 'Failed to connect to Gemini API',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Test Google Cloud TTS
 */
async function testGoogleCloudTTS(): Promise<TestResult> {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (!credentialsPath) {
    return {
      service: 'Google Cloud TTS',
      success: false,
      message: 'GOOGLE_APPLICATION_CREDENTIALS not found in environment variables',
    };
  }

  // Resolve path (handle relative paths from project root)
  const resolvedPath = path.isAbsolute(credentialsPath)
    ? credentialsPath
    : path.resolve(projectRoot, credentialsPath);

  if (!fs.existsSync(resolvedPath)) {
    return {
      service: 'Google Cloud TTS',
      success: false,
      message: `Credentials file not found at: ${resolvedPath}\n   Checked path: ${credentialsPath}\n   Project root: ${projectRoot}`,
    };
  }

  try {
    const client = new TextToSpeechClient({
      keyFilename: resolvedPath,
    });

    const request = {
      input: { text: 'Ciao, questo è un test' },
      voice: {
        languageCode: 'it-IT',
        name: 'it-IT-Wavenet-A',
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
      },
    };

    const [response] = await client.synthesizeSpeech(request);
    
    if (response.audioContent) {
      const audioLength = response.audioContent.length;
      return {
        service: 'Google Cloud TTS',
        success: true,
        message: `✅ Successfully synthesized speech (${audioLength} bytes of audio data)`,
      };
    }

    return {
      service: 'Google Cloud TTS',
      success: false,
      message: 'No audio content in response',
    };
  } catch (error) {
    return {
      service: 'Google Cloud TTS',
      success: false,
      message: 'Failed to synthesize speech',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Test AWS S3
 */
async function testAWSS3(): Promise<TestResult> {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
    const missing = [];
    if (!accessKeyId) missing.push('AWS_ACCESS_KEY_ID');
    if (!secretAccessKey) missing.push('AWS_SECRET_ACCESS_KEY');
    if (!region) missing.push('AWS_REGION');
    if (!bucketName) missing.push('AWS_S3_BUCKET_NAME');

    return {
      service: 'AWS S3',
      success: false,
      message: `Missing environment variables: ${missing.join(', ')}`,
    };
  }

  try {
    const client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Test: Check if our bucket exists and is accessible (more specific permission)
    const headCommand = new HeadBucketCommand({ Bucket: bucketName });
    await client.send(headCommand);

    return {
      service: 'AWS S3',
      success: true,
      message: `✅ Successfully connected to S3. Bucket "${bucketName}" exists and is accessible`,
    };
  } catch (error) {
    return {
      service: 'AWS S3',
      success: false,
      message: 'Failed to access S3',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 Testing External Service Credentials...\n');
  console.log('=' .repeat(60));
  console.log('');

  // Test Gemini API
  console.log('📝 Testing Gemini API...');
  const geminiResult = await testGeminiAPI();
  results.push(geminiResult);
  console.log(geminiResult.success ? '✅' : '❌', geminiResult.message);
  if (geminiResult.error) {
    console.log('   Error:', geminiResult.error);
  }
  console.log('');

  // Test Google Cloud TTS
  console.log('🔊 Testing Google Cloud TTS...');
  const ttsResult = await testGoogleCloudTTS();
  results.push(ttsResult);
  console.log(ttsResult.success ? '✅' : '❌', ttsResult.message);
  if (ttsResult.error) {
    console.log('   Error:', ttsResult.error);
  }
  console.log('');

  // Test AWS S3
  console.log('☁️  Testing AWS S3...');
  const s3Result = await testAWSS3();
  results.push(s3Result);
  console.log(s3Result.success ? '✅' : '❌', s3Result.message);
  if (s3Result.error) {
    console.log('   Error:', s3Result.error);
  }
  console.log('');

  // Summary
  console.log('=' .repeat(60));
  console.log('📊 Test Summary:');
  console.log('');
  
  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;

  results.forEach((result) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.service}: ${result.success ? 'PASS' : 'FAIL'}`);
  });

  console.log('');
  console.log(`Results: ${successCount}/${totalCount} services working`);
  console.log('');

  if (successCount === totalCount) {
    console.log('🎉 All external services are configured correctly!');
    process.exit(0);
  } else {
    console.log('⚠️  Some services need configuration. Check the errors above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Fatal error running tests:', error);
  process.exit(1);
});
