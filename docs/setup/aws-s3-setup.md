# AWS S3 Setup Guide

**⚠️ USER ACTION REQUIRED:** This setup must be completed manually by the user. Developer agents cannot automate external service account creation.

This guide walks you through setting up AWS S3 for storing generated audio files for persistent access and CDN distribution.

## Overview

AWS S3 (Simple Storage Service) is used to store generated audio files. Files are organized by content ID and served via CDN for optimal performance.

**Required Environment Variables:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (e.g., `us-east-1`)
- `AWS_S3_BUCKET_NAME`

## Prerequisites

- An AWS account (create one at https://aws.amazon.com if needed)
- Access to AWS Management Console (https://console.aws.amazon.com)

## Step-by-Step Setup

### Step 1: Create AWS Account

1. Navigate to [AWS Sign Up](https://aws.amazon.com)
2. Click **"Create an AWS Account"**
3. Follow the registration process:
   - Enter your email address and choose a password
   - Provide contact information
   - Provide payment information (required, but free tier available)
   - Verify your identity via phone call or text message
4. Select a support plan (Basic plan is free and sufficient for MVP)

**Note:** AWS requires a credit card for account creation, but you won't be charged for free tier usage.

### Step 2: Create S3 Bucket

1. Sign in to [AWS Management Console](https://console.aws.amazon.com)
2. Navigate to **S3** service (search for "S3" in the services search bar)
3. Click **"Create bucket"**
4. Configure bucket settings:
   - **Bucket name:** Choose a unique name (e.g., `adaptive-italian-audio-audio-files`)
     - Bucket names must be globally unique across all AWS accounts
     - Use lowercase letters, numbers, and hyphens only
     - Must be 3-63 characters long
   - **AWS Region:** Select a region close to your users (e.g., `us-east-1` for US East)
     - **Recommendation:** Choose a region that matches your CDN origin or user base
   - **Object Ownership:** Leave default (ACLs disabled recommended)
   - **Block Public Access settings:** Configure as follows:
     - **Block all public access:** Uncheck this (we need public read for CDN)
     - **Important:** You must uncheck ALL four sub-options:
       - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
       - ☐ Block public access to buckets and objects granted through any access control lists (ACLs)
       - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
       - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
     - Acknowledge the warning about making the bucket public (click "I acknowledge...")
   - **Bucket Versioning:** Disable (not needed for MVP)
   - **Default encryption:** Enable (recommended for security)
     - Choose **"Amazon S3 managed keys (SSE-S3)"**
   - **Object Lock:** Disable (not needed for MVP)
5. Click **"Create bucket"**

### Step 3: Configure Bucket Policy

**First, find your AWS Account ID:**
- **Method 1 (Easiest):** Look at the top right corner of the AWS Console - your account ID is displayed there (format: `1234-5678-9012` or `123456789012`)
- **Method 2:** In the IAM console, click on your username in the top right, then click "Account" - your account ID is displayed
- **Method 3:** Check any existing IAM resource ARN (like a policy ARN) - the account ID is the 12-digit number after `::` (e.g., in `arn:aws:iam::123456789012:policy/...`, the account ID is `123456789012`)

**Note:** Remove the dashes if your account ID is displayed with dashes (e.g., `6143-3354-0711` becomes `614333540711`)

1. In your S3 bucket, go to the **"Permissions"** tab
2. Scroll down to **"Bucket policy"**
3. Click **"Edit"**
4. Add the following bucket policy (replace `YOUR_BUCKET_NAME` with your actual bucket name and `YOUR_ACCOUNT_ID` with your 12-digit account ID):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    },
    {
      "Sid": "RestrictWriteToBackend",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/YOUR_IAM_USER_NAME"
      },
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

**Note:** You'll need to update this policy after creating the IAM user in Step 4. For now, you can use a simplified version that allows public read:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

5. Click **"Save changes"**

### Step 4: Create IAM User for S3 Access

1. Navigate to **IAM** service in AWS Management Console
   - If you're currently viewing a policy page, click **"Users"** in the left sidebar to navigate to the Users page
2. On the IAM Users page, click the **"Create user"** button (usually a blue button at the top right or top of the page)
3. In the **"User name"** field, enter a username (e.g., `adaptive-italian-audio-s3-user`)
4. **Important:** After entering the username, look for one of these buttons at the bottom of the page:
   - **"Next"** button (most common)
   - **"Next: Set permissions"** button
   - **"Next: Permissions"** button
   - If you don't see a Next button, try scrolling down - it may be below the username field
5. Click the **"Next"** button (or equivalent) to proceed
6. On the permissions page, under **"Set permissions"**, select **"Attach policies directly"**
7. You'll need to create a policy first. Click **"Create policy"** button (this opens a new tab or window)
8. In the policy editor:
   - Select **"JSON"** tab
   - Paste the following policy (replace `YOUR_BUCKET_NAME` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    }
  ]
}
```

9. Click **"Next"**
10. Enter a policy name (e.g., `AdaptiveItalianAudioS3Policy`)
11. Click **"Create policy"**
12. Return to the user creation tab and refresh the policies list
13. Search for and select your newly created policy
14. Click **"Next"**
15. Review and click **"Create user"**

### Step 5: Generate Access Keys

1. In the IAM Users list, click on your newly created user
2. Go to the **"Security credentials"** tab
3. Scroll down to **"Access keys"**
4. Click **"Create access key"**
5. Select **"Application running outside AWS"** as the use case
6. Click **"Next"**
7. Add a description (optional, e.g., "S3 access for Adaptive Italian Audio")
8. Click **"Create access key"**
9. **Important:** Copy both the **Access Key ID** and **Secret Access Key** immediately
   - You won't be able to view the secret access key again after closing this dialog
   - Store these credentials securely
10. Click **"Done"**

### Step 6: Configure Environment Variables

**Important:** Use the `.env` file (not `.env.example`) for your actual credentials. The `.env.example` file is just a template.

1. If you don't have a `.env` file yet, create it by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   (Or on Windows PowerShell: `Copy-Item .env.example .env`)

2. Open your `.env` file in the project root directory
3. Add the following environment variables:

```
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name_here
```

3. Replace the placeholder values:
   - `your_access_key_id_here` - Your Access Key ID from Step 5
   - `your_secret_access_key_here` - Your Secret Access Key from Step 5
   - `us-east-1` - Your bucket region (e.g., `us-east-1`, `eu-west-1`, `ap-southeast-1`)
   - `your_bucket_name_here` - Your S3 bucket name from Step 2

**Example:**
```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=adaptive-italian-audio-audio-files
```

4. Save the file

### Step 7: Update Bucket Policy with IAM User

1. Return to your S3 bucket → **"Permissions"** → **"Bucket policy"**
2. Click **"Edit"**
3. Find your IAM user ARN:
   - Go to IAM → **"Users"** → Click on your user (e.g., `adaptive-italian-audio-s3-user`)
   - In the **"Summary"** tab, find the **"User ARN"** field (format: `arn:aws:iam::123456789012:user/username`)
   - The account ID is the 12-digit number in the ARN (e.g., `123456789012`)
   - The username is the part after `user/` (e.g., `adaptive-italian-audio-s3-user`)
4. Update the bucket policy from Step 3:
   - Replace `YOUR_ACCOUNT_ID` with your 12-digit account ID (no dashes)
   - Replace `YOUR_IAM_USER_NAME` with your IAM username
5. Click **"Save changes"**

### Step 8: Verify Configuration

#### Option A: Test S3 Upload/Download (Recommended)

You can verify your credentials work by testing S3 operations:

**Using AWS CLI (if installed):**
```bash
aws s3 ls s3://YOUR_BUCKET_NAME --region YOUR_REGION
```

**Using a test script:**
Create a simple test to upload and download a file using the AWS SDK.

#### Option B: Application Startup Validation

The application includes automatic startup validation that checks for required credentials. When you start the backend server, it will:

- Check for all required AWS environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`)
- Display a warning if any credentials are missing (MVP allows graceful startup - application will start but external service features won't work)
- Provide clear error messages indicating which credentials are missing
- Include links to this setup documentation in error messages

**Validation Behavior:**
- The application validates credentials on every startup
- Missing credentials result in warnings (not errors) - the application will start normally
- External service features (audio file storage) will not work until credentials are configured
- Validation messages include direct links to setup documentation for easy reference

To verify:
1. Start the backend server: `pnpm --filter @adaptive-italian-audio/api dev`
2. Check the console output for credential validation messages
3. If credentials are missing, you'll see a warning message with links to setup guides

## Free Tier Information

### AWS Free Tier (First 12 Months)

New AWS accounts include a free tier for the first 12 months:

- **Storage:** 5 GB of standard storage
- **GET Requests:** 20,000 GET requests per month
- **PUT Requests:** 2,000 PUT requests per month
- **Data Transfer Out:** 100 GB per month (to internet)

### Post-Free Tier Costs

After 12 months or exceeding free tier limits:

- **Storage:** ~$0.023 per GB per month (very low cost)
- **GET Requests:** ~$0.0004 per 1,000 GET requests (very low cost)
- **PUT Requests:** ~$0.005 per 1,000 PUT requests
- **Data Transfer:** Varies by region and volume

**Cost Considerations:**
- Storage costs are minimal for MVP scale
- Request costs are very low
- Consider lifecycle policies to automatically delete old files after a retention period
- Monitor usage in AWS Cost Explorer

## Bucket Naming Conventions

- **Globally Unique:** Bucket names must be unique across all AWS accounts worldwide
- **Format:** Lowercase letters, numbers, and hyphens only
- **Length:** 3-63 characters
- **Recommendation:** Use a descriptive name with your project identifier (e.g., `adaptive-italian-audio-audio-files`)

## Region Selection

Choose a region based on:

- **User Base:** Select a region close to your primary users
- **CDN Origin:** If using CloudFlare CDN, choose a region that works well as an origin
- **Cost:** Some regions have slightly different pricing
- **Recommendation:** `us-east-1` (US East - N. Virginia) is commonly used and cost-effective

## File Organization

Audio files are organized by content ID in the bucket:

- **Path Pattern:** `audio/{contentId}.mp3`
- **Example:** `audio/12345.mp3`
- **Benefits:** Simple organization, easy to reference, CDN-friendly

## Security Considerations

- **Server-Side Only:** AWS credentials must be stored server-side only and never exposed to the frontend
- **Environment Variables:** Never commit access keys to version control
- **Key Rotation:** Rotate access keys periodically for security
- **Least Privilege:** IAM user should only have permissions needed for S3 operations
- **Bucket Policy:** Public read access is required for CDN, but write access is restricted to backend
- **Encryption:** Enable default encryption on the bucket (SSE-S3)

## Troubleshooting

### Cannot Save Bucket Policy - "Not Authorized" or "Public Access Block" Error

**Error Message (French):** "Vous n'êtes pas autorisé à modifier la stratégie de compartiment ou votre politique de compartiment accorde un niveau d'accès public qui entre en conflit avec vos paramètres de blocage de l'accès public."

**Solution:**

1. **Disable Block Public Access Settings (Most Common Fix):**
   - Go to your S3 bucket → **"Permissions"** tab
   - Scroll down to **"Block public access (bucket settings)"**
   - Click **"Edit"**
   - **Uncheck ALL four checkboxes:**
     - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
     - ☐ Block public access to buckets and objects granted through any access control lists (ACLs)
     - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
     - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
   - Click **"Save changes"**
   - Type `confirm` in the confirmation dialog and click **"Confirm"**

2. **Check Account-Level Block Public Access:**
   - In AWS Console, go to **S3** → Click your account name (top right) → **"Block Public Access settings for this account"**
   - If account-level blocking is enabled, you may need to disable it (or use account-level exceptions)
   - **Note:** For MVP, you can disable account-level blocking, but be cautious in production

3. **Verify Permissions:**
   - Ensure your IAM user/role has `s3:PutBucketPolicy` permission
   - If using root account, you should have full permissions
   - If using an IAM user, ensure the user has S3 management permissions

4. **Retry Bucket Policy:**
   - After disabling block public access, return to bucket → **"Permissions"** → **"Bucket policy"** → **"Edit"**
   - Try saving the policy again

### Credentials Not Working

1. Verify all environment variables are set correctly in your `.env` file
2. Check for extra spaces or newlines in the credential values
3. Ensure the access key hasn't been deactivated in IAM
4. Verify the IAM user has the correct permissions
5. Check that the bucket name matches exactly (case-sensitive)

### Bucket Access Denied

1. Verify the bucket policy allows public read access
2. Check that the IAM user policy includes necessary S3 permissions
3. Ensure the bucket name in environment variables matches the actual bucket name
4. Verify the region matches your bucket's region

### Region Mismatch

1. Ensure `AWS_REGION` matches your bucket's region exactly
2. Check the bucket region in S3 console → Bucket → Properties → Region
3. Update `AWS_REGION` if there's a mismatch

### Free Tier Limits

1. Monitor your usage in AWS Cost Explorer
2. Check S3 metrics in CloudWatch
3. Set up billing alerts to notify you of costs
4. Consider lifecycle policies to manage storage costs

## Additional Resources

- **AWS S3 Documentation:** https://docs.aws.amazon.com/s3/
- **AWS Management Console:** https://console.aws.amazon.com
- **IAM User Guide:** https://docs.aws.amazon.com/IAM/latest/UserGuide/
- **S3 Pricing:** https://aws.amazon.com/s3/pricing/
- **Free Tier Details:** https://aws.amazon.com/free/

## Next Steps

After completing this setup:

1. Verify your credentials work using the verification steps above
2. Review the [README.md Prerequisites](../../README.md#prerequisites) section
3. Ensure all three external services (Gemini API, Google Cloud TTS, AWS S3) are configured before Epic 2 implementation

---

**Setup Status:** ☐ Complete - Mark this checkbox when you've successfully configured your AWS S3 bucket and credentials and verified they work.
