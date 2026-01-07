/**
 * Credential Validator Utility
 * 
 * Validates required external service credentials on application startup.
 * For MVP, this logs warnings but allows graceful startup (does not block).
 */

interface CredentialCheck {
  name: string;
  envVar: string;
  present: boolean;
  setupGuide: string;
}

interface ValidationResult {
  allPresent: boolean;
  missing: CredentialCheck[];
  present: CredentialCheck[];
}

/**
 * Required credentials for Epic 2 external services
 */
const REQUIRED_CREDENTIALS: Array<{
  name: string;
  envVar: string;
  setupGuide: string;
}> = [
  {
    name: 'Gemini API Key',
    envVar: 'GEMINI_API_KEY',
    setupGuide: 'docs/setup/gemini-api-setup.md',
  },
  {
    name: 'Google Cloud TTS Credentials',
    envVar: 'GOOGLE_APPLICATION_CREDENTIALS',
    setupGuide: 'docs/setup/google-cloud-tts-setup.md',
  },
  {
    name: 'AWS Access Key ID',
    envVar: 'AWS_ACCESS_KEY_ID',
    setupGuide: 'docs/setup/aws-s3-setup.md',
  },
  {
    name: 'AWS Secret Access Key',
    envVar: 'AWS_SECRET_ACCESS_KEY',
    setupGuide: 'docs/setup/aws-s3-setup.md',
  },
  {
    name: 'AWS Region',
    envVar: 'AWS_REGION',
    setupGuide: 'docs/setup/aws-s3-setup.md',
  },
  {
    name: 'AWS S3 Bucket Name',
    envVar: 'AWS_S3_BUCKET_NAME',
    setupGuide: 'docs/setup/aws-s3-setup.md',
  },
];

/**
 * Validates that a credential is present and non-empty
 */
function isCredentialPresent(envVar: string): boolean {
  const value = process.env[envVar];
  return value !== undefined && value.trim() !== '';
}

/**
 * Validates Google Cloud credentials file exists (if path is provided)
 */
function validateGoogleCloudCredentials(): boolean {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialsPath) {
    return false;
  }

  // For MVP, we just check if the path is set
  // In production, you might want to verify the file exists and is readable
  // For now, we'll rely on the Google Cloud SDK to handle file validation
  return credentialsPath.trim() !== '';
}

/**
 * Validates all required external service credentials
 */
export function validateExternalServiceCredentials(): ValidationResult {
  const checks: CredentialCheck[] = REQUIRED_CREDENTIALS.map((cred) => {
    let present = false;

    if (cred.envVar === 'GOOGLE_APPLICATION_CREDENTIALS') {
      present = validateGoogleCloudCredentials();
    } else {
      present = isCredentialPresent(cred.envVar);
    }

    return {
      name: cred.name,
      envVar: cred.envVar,
      present,
      setupGuide: cred.setupGuide,
    };
  });

  const missing = checks.filter((check) => !check.present);
  const present = checks.filter((check) => check.present);

  return {
    allPresent: missing.length === 0,
    missing,
    present,
  };
}

/**
 * Formats a validation result into a user-friendly message
 */
function formatValidationMessage(result: ValidationResult): string {
  if (result.allPresent) {
    return '✅ All required external service credentials are configured.';
  }

  const lines: string[] = [];
  lines.push('⚠️  Missing external service credentials detected:');
  lines.push('');

  result.missing.forEach((check) => {
    lines.push(`   • ${check.name} (${check.envVar})`);
    lines.push(`     Setup Guide: ${check.setupGuide}`);
  });

  lines.push('');
  lines.push(
    '⚠️  NOTE: For MVP, the application will start but external service features will not work until credentials are configured.',
  );
  lines.push('');
  lines.push(
    '📖 See docs/setup/ for detailed setup instructions for each service.',
  );
  lines.push(
    '📖 See README.md Prerequisites section for an overview of required services.',
  );

  return lines.join('\n');
}

/**
 * Validates credentials and logs warnings if any are missing
 * For MVP: Logs warnings but does not block startup
 */
export function validateAndLogCredentials(): void {
  const result = validateExternalServiceCredentials();
  const message = formatValidationMessage(result);

  if (result.allPresent) {
    console.log(message);
  } else {
    console.warn(message);
    console.warn(
      '\n⚠️  External service features will not be available until credentials are configured.',
    );
  }
}
