/**
 * Content Validator Utility
 * 
 * Validates generated Italian content for quality and model compliance.
 * Checks non-empty, minimum length, Italian language detection, and model criteria.
 */

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Content validation options
 */
export interface ValidationOptions {
  minWords?: number;
  maxWords?: number;
  requireItalian?: boolean;
  checkModelCriteria?: boolean;
}

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: Required<ValidationOptions> = {
  minWords: 100,
  maxWords: 1000,
  requireItalian: true,
  checkModelCriteria: true,
};

/**
 * Validate generated content
 * 
 * @param textContent - Generated text content to validate
 * @param format - Content format (affects minimum length requirements)
 * @param options - Validation options
 * @returns Validation result with errors if invalid
 */
export function validateContent(
  textContent: string,
  format: 'narrative' | 'podcast' | 'educational',
  options: ValidationOptions = {}
): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: string[] = [];

  // Adjust minimum words based on format
  const formatMinWords = format === 'narrative' ? 100 : 50;
  const minWords = opts.minWords || formatMinWords;

  // Check non-empty
  if (!textContent || textContent.trim().length === 0) {
    errors.push('Content is empty');
    return { valid: false, errors };
  }

  // Check minimum length
  const wordCount = countWords(textContent);
  if (wordCount < minWords) {
    errors.push(`Content is too short: ${wordCount} words (minimum: ${minWords})`);
  }

  // Check maximum length
  if (opts.maxWords && wordCount > opts.maxWords) {
    errors.push(`Content is too long: ${wordCount} words (maximum: ${opts.maxWords})`);
  }

  // Check Italian language (basic detection)
  if (opts.requireItalian) {
    if (!isLikelyItalian(textContent)) {
      errors.push('Content does not appear to be in Italian');
    }
  }

  // Check model criteria (basic checks)
  if (opts.checkModelCriteria) {
    const modelErrors = checkModelCriteria(textContent);
    errors.push(...modelErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Basic Italian language detection
 * Checks for common Italian words and patterns
 */
function isLikelyItalian(text: string): boolean {
  const italianIndicators = [
    /\b(il|la|lo|gli|le|un|una|uno|di|a|da|in|con|su|per|tra|fra)\b/gi,
    /\b(è|sono|ha|hanno|era|erano|sarà|saranno)\b/gi,
    /\b(che|chi|cosa|come|dove|quando|perché|perchè)\b/gi,
    /\b(non|non|mai|sempre|oggi|ieri|domani)\b/gi,
    /[àèéìòù]/g, // Italian accented vowels
  ];

  let matches = 0;
  for (const pattern of italianIndicators) {
    const found = text.match(pattern);
    if (found) {
      matches += found.length;
    }
  }

  // If we find at least 5 Italian indicators, consider it Italian
  return matches >= 5;
}

/**
 * Check model criteria compliance
 * Basic checks for meaning-first, comprehensibility, variation
 */
function checkModelCriteria(text: string): string[] {
  const errors: string[] = [];

  // Check for meaningful content (not just random words)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 3) {
    errors.push('Content appears too fragmented (model requires coherent narrative)');
  }

  // Check for variation (not just repetition)
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  const repetitionRatio = uniqueWords.size / words.length;
  if (repetitionRatio < 0.3 && words.length > 50) {
    errors.push('Content appears too repetitive (model requires controlled variation)');
  }

  // Check for semantic coherence (basic: check for common Italian sentence structures)
  const hasVerbs = /\b(è|sono|ha|hanno|era|erano|fa|fanno|va|vanno|sta|stanno)\b/gi.test(text);
  if (!hasVerbs && words.length > 20) {
    errors.push('Content may lack semantic coherence (no clear verb structures found)');
  }

  return errors;
}

/**
 * Retry validation with relaxed criteria
 */
export function validateWithRetry(
  textContent: string,
  format: 'narrative' | 'podcast' | 'educational',
  retryCount: number = 0
): ValidationResult {
  const options: ValidationOptions = {
    minWords: retryCount > 0 ? 50 : 100, // Relax minimum on retry
    requireItalian: true,
    checkModelCriteria: retryCount === 0, // Skip model criteria on retry
  };

  return validateContent(textContent, format, options);
}
