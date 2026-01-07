# Google Cloud Text-to-Speech Setup Guide

**⚠️ USER ACTION REQUIRED:** This setup must be completed manually by the user. Developer agents cannot automate external service account creation.

This guide walks you through setting up Google Cloud Text-to-Speech API for converting Italian text into high-quality natural-sounding speech.

## Overview

Google Cloud Text-to-Speech API is the primary TTS service for audio generation. It converts generated Italian text into speech using high-quality neural voices.

**Required Environment Variable:** `GOOGLE_APPLICATION_CREDENTIALS` (path to service account JSON key file)

## Prerequisites

- A Google account
- Access to Google Cloud Console (https://console.cloud.google.com)

## Step-by-Step Setup

### Step 1: Create Google Cloud Account

1. Navigate to [Google Cloud Console](https://console.cloud.google.com)
2. Sign in with your Google account
3. If you don't have a Google Cloud account, click **"Get Started"** and follow the prompts
4. Accept the terms of service and create your account

### Step 2: Create Google Cloud Project

1. In Google Cloud Console, click the project dropdown at the top
2. Click **"New Project"**
3. Enter a project name (e.g., `adaptive-italian-audio`)
4. Select a billing account (required for API access, even with free tier)
5. Click **"Create"**
6. Wait for the project to be created, then select it from the project dropdown

**Note:** Even though TTS has a free tier, Google Cloud requires a billing account to be linked. You won't be charged for free tier usage, but billing must be enabled.

### Step 3: Enable Text-to-Speech API

1. In Google Cloud Console, navigate to **"APIs & Services"** → **"Library"**
2. Search for **"Cloud Text-to-Speech API"**
3. Click on **"Cloud Text-to-Speech API"**
4. Click **"Enable"**
5. Wait for the API to be enabled (may take a minute)

### Step 4: Create Service Account

1. In Google Cloud Console, navigate to **"IAM & Admin"** → **"Service Accounts"**
2. Click **"Create Service Account"**
3. Enter a service account name (e.g., `tts-service-account`)
4. Enter a description (e.g., `Service account for Text-to-Speech API access`)
5. Click **"Create and Continue"**
6. Grant the service account the **"Cloud Text-to-Speech API User"** role:
   - Click **"Select a role"**
   - Search for and select **"Cloud Text-to-Speech API User"**
   - Click **"Continue"**
7. Click **"Done"** (you can skip the optional step of granting users access)

### Step 5: Create and Download Service Account Key

1. In the Service Accounts list, find your newly created service account
2. Click on the service account email to open its details
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Select **"JSON"** as the key type
6. Click **"Create"**
7. The JSON key file will automatically download to your computer
8. **Important:** Store this file securely - you won't be able to download it again

**Security Note:** Keep this JSON file secure and never commit it to version control.

### Step 6: Configure Credentials

You have two options for configuring credentials:

#### Option A: Service Account JSON Key File (Recommended)

**Important:** Use the `.env` file (not `.env.example`) for your actual credentials. The `.env.example` file is just a template.

1. If you don't have a `.env` file yet, create it by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   (Or on Windows PowerShell: `Copy-Item .env.example .env`)

2. Place the downloaded JSON key file in a secure location (e.g., `config/google-cloud-key.json` in your project root)
3. Add the file path to your `.env` file:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=config/google-cloud-key.json
   ```
3. Ensure the path is relative to your project root or use an absolute path

**Example:**
```
GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-key.json
```

#### Option B: Application Default Credentials (Alternative)

If you're running the application on Google Cloud infrastructure (e.g., Cloud Run, Compute Engine), you can use Application Default Credentials instead:

1. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of your JSON key file, OR
2. Use `gcloud auth application-default login` to set up ADC locally

**Note:** For local development and most deployment scenarios, Option A (JSON key file) is recommended.

### Step 7: Verify Configuration

#### Option A: Test TTS API Call (Recommended)

You can verify your credentials work by making a test API call:

```bash
curl -X POST \
  'https://texttospeech.googleapis.com/v1/text:synthesize' \
  -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  -H 'Content-Type: application/json' \
  -d '{
    "input": {"text": "Ciao, questo è un test"},
    "voice": {"languageCode": "it-IT", "name": "it-IT-Wavenet-A"},
    "audioConfig": {"audioEncoding": "MP3"}
  }'
```

**Note:** For JSON key file authentication, you may need to use the Google Cloud client library or set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable before running the curl command.

#### Option B: Application Startup Validation

The application includes automatic startup validation that checks for required credentials. When you start the backend server, it will:

- Check for the `GOOGLE_APPLICATION_CREDENTIALS` environment variable
- Verify the file path is set (file existence validation handled by Google Cloud SDK)
- Display a warning if credentials are missing (MVP allows graceful startup - application will start but external service features won't work)
- Provide clear error messages indicating which credentials are missing
- Include links to this setup documentation in error messages

**Validation Behavior:**
- The application validates credentials on every startup
- Missing credentials result in warnings (not errors) - the application will start normally
- External service features (TTS synthesis) will not work until credentials are configured
- Validation messages include direct links to setup documentation for easy reference

To verify:
1. Start the backend server: `pnpm --filter @adaptive-italian-audio/api dev`
2. Check the console output for credential validation messages
3. If credentials are missing, you'll see a warning message with links to setup guides

## Free Tier Information

### Always Free Tier

Google Cloud Text-to-Speech API includes an **Always Free tier** with no expiration:

- **Free Tier:** 0-4 million characters per month (varies by region)
- **Standard Voices:** Included in free tier (including Wavenet voices)
- **No Expiration:** This is part of Google Cloud's Always Free tier program
- **Regional Variations:** Free tier limits may vary slightly by region

### What's Included

- **Standard Voices:** Free tier includes standard voices (including Wavenet)
- **Neural2 Voices:** May be included depending on region and account tier
- **Audio Formats:** MP3 and other formats supported in free tier

### Post-Free Tier Pricing

After exceeding free tier limits:
- Usage-based pricing applies
- Costs are typically very low per character
- Check Google Cloud pricing documentation for current rates

## Rate Limits

- **Rate Limits:** Vary by region and account tier
- **Free Tier Limits:** 0-4 million characters per month (varies by region)
- **Handling:** The application implements exponential backoff retry logic
- **Best Practice:** Monitor character usage to stay within free tier limits

## Italian Voice Selection

For Italian language learning content, the following voices are recommended:

- **`it-IT-Wavenet-A`** - High-quality Wavenet voice (included in free tier)
- **`it-IT-Neural2-A`** - Neural2 voice (may be available in free tier depending on region)

**Language Code:** `it-IT` (Italian - Italy)

**Audio Encoding:** `MP3` (128kbps recommended for optimal quality/file size balance)

## Security Considerations

- **Server-Side Only:** Service account credentials must be stored server-side only and never exposed to the frontend
- **Environment Variables:** Never commit JSON key files to version control
- **Key Rotation:** Rotate service account keys periodically for security
- **Least Privilege:** Service account should only have the minimum required permissions (Cloud Text-to-Speech API User role)
- **File Permissions:** Restrict file permissions on the JSON key file (e.g., `chmod 600` on Unix systems)

## Troubleshooting

### Credentials Not Working

1. Verify the `GOOGLE_APPLICATION_CREDENTIALS` path is correct in your `.env` file
2. Ensure the JSON key file exists at the specified path
3. Check file permissions (file must be readable)
4. Verify the service account has the correct role (Cloud Text-to-Speech API User)
5. Ensure the Text-to-Speech API is enabled in your Google Cloud project

### API Not Enabled

1. Go to Google Cloud Console → APIs & Services → Library
2. Search for "Cloud Text-to-Speech API"
3. Verify it shows "Enabled" status
4. If not enabled, click "Enable"

### Billing Account Issues

1. Even with free tier, a billing account must be linked to your Google Cloud project
2. Go to Google Cloud Console → Billing
3. Verify a billing account is linked to your project
4. You won't be charged for free tier usage, but billing must be enabled

### Free Tier Limits

1. Monitor your usage in Google Cloud Console → APIs & Services → Dashboard
2. Check the Text-to-Speech API usage metrics
3. Plan for post-free-tier costs if you expect to exceed limits

## Additional Resources

- **Google Cloud TTS Documentation:** https://cloud.google.com/text-to-speech/docs
- **Google Cloud Console:** https://console.cloud.google.com
- **Service Accounts Guide:** https://cloud.google.com/iam/docs/service-accounts
- **Pricing Information:** Check Google Cloud pricing documentation for current rates

## Next Steps

After completing this setup:

1. Verify your credentials work using the verification steps above
2. Proceed with [AWS S3 Setup](aws-s3-setup.md)
3. Review the [README.md Prerequisites](../../README.md#prerequisites) section

---

**Setup Status:** ☐ Complete - Mark this checkbox when you've successfully configured your Google Cloud TTS credentials and verified they work.
