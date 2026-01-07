/**
 * Script to list available Gemini models from the API
 * 
 * Usage: pnpm tsx src/scripts/list-gemini-models.ts
 */

import 'dotenv/config';
import { request as undiciRequest } from 'undici';

async function listGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables');
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  console.log('🔍 Fetching available models from Gemini API...\n');
  
  try {
    const { statusCode, body } = await undiciRequest(url, { method: 'GET' });
    
    if (statusCode < 200 || statusCode >= 300) {
      const text = await (body as any).text?.();
      console.error(`❌ Failed to list models: HTTP ${statusCode}`);
      console.error('Response:', text);
      process.exit(1);
    }

    const json = (await body.json()) as any;
    const models = json?.models || [];
    
    if (models.length === 0) {
      console.log('⚠️  No models found in response');
      console.log('Raw response:', JSON.stringify(json, null, 2));
      return;
    }

    console.log(`✅ Found ${models.length} models:\n`);
    
    const modelsWithGenerateContent = [];
    
    for (const model of models) {
      const modelName = model.name?.replace('models/', '') || 'unknown';
      const displayName = model.displayName || 'N/A';
      const description = model.description || 'N/A';
      const supportedMethods = model.supportedGenerationMethods || [];
      const supportsGenerateContent = supportedMethods.includes('generateContent');
      
      console.log(`📦 ${modelName}`);
      console.log(`   Display Name: ${displayName}`);
      console.log(`   Description: ${description}`);
      console.log(`   Supported Methods: ${supportedMethods.join(', ') || 'none'}`);
      console.log(`   ✅ Supports generateContent: ${supportsGenerateContent ? 'YES' : 'NO'}`);
      console.log('');
      
      if (supportsGenerateContent) {
        modelsWithGenerateContent.push(modelName);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 Summary:');
    console.log(`   Total models: ${models.length}`);
    console.log(`   Models supporting generateContent: ${modelsWithGenerateContent.length}`);
    
    if (modelsWithGenerateContent.length > 0) {
      console.log('\n✅ Available models for generateContent:');
      modelsWithGenerateContent.forEach(name => {
        console.log(`   • ${name}`);
      });
      console.log('\n💡 Recommended model: ' + modelsWithGenerateContent[0]);
    } else {
      console.log('\n⚠️  No models found that support generateContent');
    }
    
  } catch (err) {
    console.error('❌ Error listing models:', err);
    if (err instanceof Error) {
      console.error('Stack:', err.stack);
    }
    process.exit(1);
  }
}

listGeminiModels();
