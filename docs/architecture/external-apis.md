# External APIs


External service integrations required for the application. Documented with authentication methods, endpoints, rate limits, and integration considerations.

## OpenAI API

**Purpose:** Generate Italian text content following model-driven principles. Primary text generation service for narratives, podcasts, and educational content.

**Documentation:** https://platform.openai.com/docs/api-reference

**Base URL(s):**
- Production: `https://api.openai.com/v1`
- Text generation endpoint: `POST /chat/completions`

**Authentication:**
- Method: Bearer token (API key in Authorization header)
- API key stored in environment variable: `OPENAI_API_KEY`
- Security: API key stored server-side only, never exposed to frontend

**Rate Limits:**
- Free tier: Limited requests per minute (varies by model)
- GPT-3.5-turbo: Recommended for MVP (cost-effective)
- GPT-4: Available for higher quality when needed
- Rate limit handling: Exponential backoff retry logic, queue-based request management

**Key Endpoints Used:**
- `POST /v1/chat/completions` - Generate Italian text content
  - Model: `gpt-3.5-turbo` (primary) or `gpt-4` (when quality needed)
  - Messages: System prompt (model-driven) + user prompt (content request)
  - Temperature: Controlled by model service parameters
  - Max tokens: Based on content length requirements

**Integration Notes:**
- Model service determines generation parameters (prompt structure, temperature, token limits)
- Content Generation Service constructs prompts according to model principles
- Rate limiting managed by Content Generation Service with retry logic
- Error handling: Network errors, API errors, timeout errors with appropriate fallbacks
- Cost management: Monitor token usage, prefer GPT-3.5-turbo for MVP scale

## Google Cloud Text-to-Speech API

**Purpose:** Convert generated Italian text into high-quality natural-sounding speech. Primary TTS service for audio generation.

**Documentation:** https://cloud.google.com/text-to-speech/docs

**Base URL(s):**
- Production: `https://texttospeech.googleapis.com/v1`
- Synthesis endpoint: `POST /text:synthesize`

**Authentication:**
- Method: Service account JSON key file or Application Default Credentials
- Credentials stored in environment variable: `GOOGLE_APPLICATION_CREDENTIALS` (path to JSON key file)
- Security: Service account credentials stored server-side only

**Rate Limits:**
- Free tier: 0-4 million characters per month (varies by region)
- Paid tier: Usage-based pricing after free tier
- Rate limit handling: Exponential backoff retry logic

**Key Endpoints Used:**
- `POST /v1/text:synthesize` - Synthesize Italian speech from text
  - Language code: `it-IT` (Italian - Italy)
  - Voice: Italian voice (e.g., `it-IT-Wavenet-A` or `it-IT-Neural2-A`)
  - Audio encoding: `MP3` (128kbps recommended)
  - SSML: Optional for pronunciation control

**Integration Notes:**
- TTS Service handles API integration and error management
- Italian voice selection optimized for natural speech and language learning
- Audio format configured for optimal quality and file size balance
- Fallback to Azure TTS on Google Cloud failure (see Azure TTS section)
- Cost management: Monitor character usage, optimize for free tier limits

## Azure Cognitive Services Text-to-Speech API (Fallback)

**Purpose:** Fallback TTS service when Google Cloud TTS is unavailable or rate-limited.

**Documentation:** https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/

**Base URL(s):**
- Production: `https://{region}.tts.speech.microsoft.com/cognitiveservices/v1`
- Synthesis endpoint: `POST /` (SSML-based)

**Authentication:**
- Method: Subscription key in `Ocp-Apim-Subscription-Key` header
- Subscription key stored in environment variable: `AZURE_TTS_SUBSCRIPTION_KEY`
- Region stored in environment variable: `AZURE_TTS_REGION`
- Security: Subscription key stored server-side only

**Rate Limits:**
- Free tier: 0-5 million characters per month
- Standard tier: Usage-based pricing
- Rate limit handling: Exponential backoff retry logic

**Key Endpoints Used:**
- `POST /cognitiveservices/v1` - Synthesize Italian speech from SSML
  - Language: `it-IT` (Italian)
  - Voice: Italian neural voice (e.g., `it-IT-ElsaNeural`)
  - Audio format: `audio-24khz-48kbitrate-mono-mp3`

**Integration Notes:**
- Used only as fallback when Google Cloud TTS fails
- TTS Service implements fallback logic with automatic retry
- SSML format required (different from Google Cloud API)
- Cost management: Monitor usage, primarily for fallback scenarios

## AWS S3 (Simple Storage Service)

**Purpose:** Store generated audio files for persistent access and CDN distribution.

**Documentation:** https://docs.aws.amazon.com/s3/

**Base URL(s):**
- Region-specific endpoints (e.g., `https://s3.us-east-1.amazonaws.com`)
- Bucket: Configured bucket name for audio files

**Authentication:**
- Method: AWS IAM credentials (Access Key ID + Secret Access Key)
- Credentials stored in environment variables:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION` (e.g., `us-east-1`)
- Security: IAM credentials stored server-side only, bucket policy restricts access

**Rate Limits:**
- No explicit rate limits, but request throttling possible at high volumes
- Best practices: Use multipart uploads for large files, implement retry logic

**Key Endpoints Used:**
- `PUT /{bucket}/{key}` - Upload audio file
- `GET /{bucket}/{key}` - Retrieve audio file (via CDN, not direct)
- `HEAD /{bucket}/{key}` - Check file existence

**Integration Notes:**
- Audio Processing Service handles S3 uploads
- Files organized by content ID: `audio/{contentId}.mp3`
- CDN (CloudFlare) configured to serve from S3 origin
- Bucket policy: Public read access for CDN, write access restricted to backend
- Cost management: Monitor storage and request costs, lifecycle policies for old files

## CloudFlare CDN

**Purpose:** Deliver audio files globally with low latency and high performance.

**Documentation:** https://developers.cloudflare.com/

**Base URL(s):**
- CDN domain: Configured CloudFlare domain (e.g., `cdn.adaptive-italian-audio.com`)
- Origin: AWS S3 bucket

**Authentication:**
- Method: None (public CDN access)
- Security: CloudFlare security features (DDoS protection, WAF)

**Rate Limits:**
- No explicit rate limits for CDN delivery
- Bandwidth limits based on CloudFlare plan

**Key Endpoints Used:**
- `GET /audio/{contentId}.mp3` - Deliver audio file via CDN
- Caching: Audio files cached at edge locations

**Integration Notes:**
- CDN configured to cache audio files from S3 origin
- Cache headers: Long cache TTL for audio files (immutable content)
- Frontend uses CDN URLs for audio playback
- Cost management: Monitor bandwidth usage, optimize cache hit rates

---

