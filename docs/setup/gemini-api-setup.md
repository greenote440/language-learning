# Gemini API Setup Guide

**⚠️ USER ACTION REQUIRED:** This setup must be completed manually by the user. Developer agents cannot automate external service account creation.

This guide walks you through setting up a Gemini API account and obtaining an API key for Italian content generation in the Adaptive Italian Audio application.

## Overview

The Gemini API (Google AI) is used to generate Italian text content following model-driven principles. The API key is required for Epic 2 implementation.

**Required Environment Variable:** `GEMINI_API_KEY`

## Prerequisites

- A Google account
- Access to Google AI Studio (https://aistudio.google.com)

## Step-by-Step Setup

### Step 1: Access Google AI Studio

1. Navigate to [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. If prompted, accept the terms of service

### Step 2: Generate API Key

1. In Google AI Studio, click on **"Get API Key"** (usually in the top right or main dashboard)
2. If you don't have a Google Cloud project, you'll be prompted to create one:
   - Click **"Create API Key"**
   - Select **"Create API key in new project"** (recommended) or choose an existing project
   - Click **"Create API key in new project"**
3. Your API key will be displayed on screen
4. **Important:** Copy the API key immediately - you won't be able to view it again after closing the dialog
5. Store the API key securely (you'll need it for environment configuration)

### Step 3: Configure Environment Variable

**Important:** Use the `.env` file (not `.env.example`) for your actual credentials. The `.env.example` file is just a template.

1. If you don't have a `.env` file yet, create it by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   (Or on Windows PowerShell: `Copy-Item .env.example .env`)

2. Open your `.env` file in the project root directory
3. Add the following line:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Replace `your_gemini_api_key_here` with your actual API key from Step 2
4. Save the file

**Example:**
```
GEMINI_API_KEY=AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz
```

### Step 4: Verify Configuration

#### Option A: Test API Call (Recommended)

You can verify your API key works by making a test API call:

```bash
curl -X POST \
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello in Italian"
      }]
    }]
  }'
```

Replace `YOUR_API_KEY` with your actual API key. A successful response indicates your API key is valid.

#### Option B: Application Startup Validation

The application includes automatic startup validation that checks for required credentials. When you start the backend server, it will:

- Check for the `GEMINI_API_KEY` environment variable
- Display a warning if the key is missing (MVP allows graceful startup - application will start but external service features won't work)
- Provide clear error messages indicating which credentials are missing
- Include links to this setup documentation in error messages

**Validation Behavior:**
- The application validates credentials on every startup
- Missing credentials result in warnings (not errors) - the application will start normally
- External service features (content generation, TTS, file storage) will not work until credentials are configured
- Validation messages include direct links to setup documentation for easy reference

To verify:
1. Start the backend server: `pnpm --filter @adaptive-italian-audio/api dev`
2. Check the console output for credential validation messages
3. If credentials are missing, you'll see a warning message with links to setup guides

## Pricing Information

### Cost Structure

- **Billing Model:** Gemini API is billed per input/output tokens (not per request)
- **No Traditional Free Tier:** Unlike some APIs, Gemini API does not have a traditional "always-free" tier
- **Bundled Usage:** Some Gemini subscriptions (e.g., Gemini Advanced) include bundled API usage via Google AI Studio
- **Pay-as-you-go:** If not using bundled subscription usage, you'll be billed based on token consumption

### Cost Expectations for MVP Scale

For the `gemini-1.5-pro` model at MVP scale:

- **Model:** `gemini-1.5-pro` (recommended for MVP - cost-effective and capable)
- **Typical Usage:** Content generation for Italian narratives, podcasts, and educational content
- **Cost Factors:**
  - Input tokens: Text prompts and context
  - Output tokens: Generated Italian content
  - Token costs vary by model tier

**Recommendation:** Monitor token usage during MVP development. Consider leveraging bundled usage if you have a Gemini subscription, or budget for pay-as-you-go token costs.

### Rate Limits

- **Rate Limits:** Vary by account tier and subscription level
- **Handling:** The application implements exponential backoff retry logic and queue-based request management
- **Best Practice:** Monitor API usage and implement appropriate rate limiting in your application

## Recommended Model Selection

For MVP implementation:

- **Primary Model:** `gemini-1.5-pro`
  - Cost-effective for MVP scale
  - Capable of generating high-quality Italian content
  - Suitable for narratives, podcasts, and educational content

**Note:** Model selection is configured in the application code. The default model (`gemini-1.5-pro`) can be changed if needed for different use cases.

## Account Requirements

**Important:** Gemini API usage requires either:
- A paid Google Cloud account with billing enabled, OR
- Bundled usage via a Gemini subscription (e.g., Gemini Advanced) that includes API access

If you're using bundled subscription usage, ensure your subscription includes API access and monitor usage limits.

## Security Considerations

- **Server-Side Only:** The API key must be stored server-side only and never exposed to the frontend
- **Environment Variables:** Never commit API keys to version control
- **Key Rotation:** Rotate API keys periodically for security
- **Access Control:** Restrict API key usage to your application's needs

## Troubleshooting

### API Key Not Working

1. Verify the API key is correctly set in your `.env` file
2. Check for extra spaces or newlines in the API key value
3. Ensure the API key hasn't been revoked in Google AI Studio
4. Verify your Google Cloud project has billing enabled (if not using bundled subscription)

### Rate Limit Errors

1. Check your account tier and rate limits in Google AI Studio
2. Implement exponential backoff in your application
3. Monitor token usage to stay within limits

### Billing Issues

1. Verify billing is enabled in your Google Cloud project
2. Check your billing account status
3. Monitor usage in Google Cloud Console

## Additional Resources

- **Gemini API Documentation:** https://ai.google.dev/gemini-api/docs
- **Google AI Studio:** https://aistudio.google.com
- **Google Cloud Console:** https://console.cloud.google.com
- **Pricing Information:** Check Google Cloud pricing documentation for current token costs

## Next Steps

After completing this setup:

1. Verify your API key works using the verification steps above
2. Proceed with [Google Cloud TTS Setup](google-cloud-tts-setup.md)
3. Proceed with [AWS S3 Setup](aws-s3-setup.md)
4. Review the [README.md Prerequisites](../../README.md#prerequisites) section

---

**Setup Status:** ☐ Complete - Mark this checkbox when you've successfully configured your Gemini API key and verified it works.
