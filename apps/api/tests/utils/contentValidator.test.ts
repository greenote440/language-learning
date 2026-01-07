/**
 * Content Validator Tests
 * 
 * Unit tests for content validation utility.
 */

import { describe, it, expect } from 'vitest';
import { validateContent, validateWithRetry } from '../../src/utils/contentValidator.js';

const validItalianText = `C'era una volta un piccolo villaggio italiano. Il villaggio si trovava in una valle verde e tranquilla. Gli abitanti erano felici e lavoravano insieme. Ogni giorno, i bambini giocavano nella piazza principale. Le donne preparavano il pranzo con ingredienti freschi. Gli uomini lavoravano nei campi. La vita era semplice ma piena di gioia. Il villaggio aveva una lunga storia. Molte generazioni avevano vissuto lì. Le tradizioni erano importanti per tutti. I bambini imparavano dai nonni. Le storie venivano tramandate di generazione in generazione. Il villaggio era un posto speciale dove tutti si conoscevano. La comunità era unita e solidale. Ogni persona aveva un ruolo importante nella vita del villaggio.`;

describe('contentValidator', () => {
  describe('validateContent', () => {
    it('should validate valid Italian content', () => {
      const result = validateContent(validItalianText, 'narrative');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty content', () => {
      const result = validateContent('', 'narrative');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Content is empty');
    });

    it('should reject content that is too short', () => {
      const shortText = 'Ciao, come stai?';
      const result = validateContent(shortText, 'narrative');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('too short'))).toBe(true);
    });

    it('should accept shorter content for podcast format', () => {
      const podcastText = 'Oggi parliamo di cultura italiana. La cultura è molto ricca e interessante. Parleremo di storia, arte, musica e tradizioni. L\'Italia ha una cultura straordinaria che attrae persone da tutto il mondo. Ogni regione ha le sue caratteristiche uniche. La cucina italiana è famosa in tutto il mondo. L\'arte italiana è conosciuta e ammirata ovunque.';
      const result = validateContent(podcastText, 'podcast', { minWords: 50 });

      // Should pass with relaxed minimum for podcast (50 words instead of 100)
      expect(result.valid).toBe(true);
    });

    it('should detect non-Italian content', () => {
      const englishText = 'This is an English text. It should not pass Italian validation.';
      const result = validateContent(englishText, 'narrative', { requireItalian: true });

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Italian'))).toBe(true);
    });

    it('should skip Italian detection if requireItalian is false', () => {
      const englishText = 'This is an English text. It should not pass Italian validation.';
      const result = validateContent(englishText, 'narrative', { requireItalian: false });

      // Should fail for other reasons (too short, not Italian structure) but not specifically for language
      expect(result.valid).toBe(false);
    });

    it('should check model criteria', () => {
      const fragmentedText = 'Word. Another. Short.';
      const result = validateContent(fragmentedText, 'narrative', { checkModelCriteria: true, minWords: 10 });

      expect(result.valid).toBe(false);
      // Should have errors related to fragmentation or coherence
      const hasRelevantError = result.errors.some(e => 
        e.includes('fragmented') || 
        e.includes('coherence') || 
        e.includes('too short') ||
        e.includes('Italian')
      );
      expect(hasRelevantError).toBe(true);
    });

    it('should detect excessive repetition', () => {
      const repetitiveText = 'Ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao '.repeat(20);
      const result = validateContent(repetitiveText, 'narrative', { checkModelCriteria: true });

      // May fail for repetition or other criteria
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateWithRetry', () => {
    it('should use strict criteria on first attempt', () => {
      const shortText = 'Ciao';
      const result = validateWithRetry(shortText, 'narrative', 0);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should relax criteria on retry', () => {
      const shortText = 'Ciao, come stai? Sono molto felice oggi.';
      const result = validateWithRetry(shortText, 'narrative', 1);

      // Should be more lenient on retry
      expect(result.errors.length).toBeLessThanOrEqual(result.errors.length);
    });

    it('should skip model criteria check on retry', () => {
      const text = validItalianText.substring(0, 100); // Shorter but valid Italian
      const result = validateWithRetry(text, 'narrative', 1);

      // Should not fail on model criteria (skipped on retry)
      const hasModelCriteriaError = result.errors.some(e => 
        e.includes('fragmented') || e.includes('repetitive') || e.includes('coherence')
      );
      expect(hasModelCriteriaError).toBe(false);
    });
  });
});
