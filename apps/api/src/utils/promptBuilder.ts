/**
 * Prompt Builder Utility
 * 
 * Builds prompts for Gemini API based on model principles and generation parameters.
 * Implements meaning-first approach, meaning anchoring, and controlled variation.
 */

import { GenerationParameters } from '@adaptive-italian-audio/model-service';
import { ContentFormat } from '../services/contentGeneration.service.js';

/**
 * Prompt engineering guidance based on model principles
 */
export interface PromptGuidance {
  meaningFirstApproach: string;
  variationSpecification: string;
  comprehensibilityGuidance: string;
  semanticAnchoringGuidance: string;
}

/**
 * Build prompt for content generation based on model principles
 * 
 * @param format - Content format (narrative, podcast, educational)
 * @param modelParameters - Model-driven generation parameters
 * @param guidance - Prompt engineering guidance from model service
 * @param continuityContext - Optional continuity context for serial narratives
 * @returns Complete prompt for Gemini API
 */
export function buildContentPrompt(
  format: ContentFormat,
  modelParameters: GenerationParameters,
  guidance: PromptGuidance,
  continuityContext?: {
    previousEpisodeId?: string;
    episodeNumber?: number;
    storylineContext?: string;
  }
): string {
  const formatInstructions = getFormatInstructions(format);
  const modelInstructions = buildModelInstructions(modelParameters, guidance);
  const continuityInstructions = buildContinuityInstructions(continuityContext);

  return `${formatInstructions}

${modelInstructions}

${continuityInstructions}

IMPORTANT: Write in Italian. The content must be:
- Semantically grounded and meaningful (not random sentences)
- Comprehensible with appropriate difficulty level
- Grammatically correct and coherent
- Engaging and culturally authentic
- Approximately 200-400 words in length`;
}

/**
 * Get format-specific instructions
 */
function getFormatInstructions(format: ContentFormat): string {
  switch (format) {
    case 'narrative':
      return `Create an engaging Italian narrative/story. The story should:
- Have a clear beginning, middle, and end
- Include characters, setting, and plot
- Use descriptive language that creates vivid scenes
- Be suitable for language learners (clear, comprehensible)`;

    case 'podcast':
      return `Create an Italian podcast-style content. The content should:
- Be conversational and informative
- Use a natural, engaging speaking style
- Include interesting topics or discussions
- Be suitable for listening practice`;

    case 'educational':
      return `Create educational/explanatory Italian content. The content should:
- Explain a topic clearly and systematically
- Use tutorial-style structure
- Include examples and explanations
- Be suitable for learning new concepts in Italian`;

    default:
      return 'Create engaging Italian content suitable for language learners.';
  }
}

/**
 * Build model-driven instructions
 */
function buildModelInstructions(
  modelParameters: GenerationParameters,
  guidance: PromptGuidance
): string {
  return `MODEL-DRIVEN GENERATION REQUIREMENTS:

1. MEANING-FIRST APPROACH:
${guidance.meaningFirstApproach}
- Prioritize semantic grounding over grammatical complexity
- Language must be coupled to situational context and narrative coherence
- Ensure content is meaningful and engaging, not just grammatically correct

2. COMPREHENSIBILITY TARGET:
${guidance.comprehensibilityGuidance}
- Target comprehensibility level: ${modelParameters.comprehensibilityTarget.toFixed(2)}
- Use known vocabulary and constructions to support inference of new material
- Gate by semantic access, not grammar mastery

3. CONTROLLED VARIATION:
${guidance.variationSpecification}
- Variation pattern: ${modelParameters.variationPattern}
- Express the same meaning using different phrasings and structures
- Maintain semantic stability while varying syntax

4. SEMANTIC ANCHORING:
${guidance.semanticAnchoringGuidance}
- Semantic stability requirement: ${modelParameters.semanticStability.toFixed(2)}
- Anchor language to non-linguistic context (scenes, actions, emotions, intentions)
- Ensure narrative coherence and situational grounding

5. LEXICAL NOVELTY:
- Lexical novelty budget: ${modelParameters.lexicalNoveltyBudget.toFixed(3)}
- Introduce new vocabulary gradually (approximately ${Math.round(modelParameters.lexicalNoveltyBudget * 100)}% new words)
- Use high-frequency vocabulary as foundation

6. CONSTRUCTION SETS:
- Use these grammatical patterns: ${modelParameters.constructionSets.join(', ')}
- Ensure constructions are appropriate for the difficulty level
- Vary constructions while maintaining meaning`;
}

/**
 * Build continuity instructions for serial narratives
 */
function buildContinuityInstructions(
  continuityContext?: {
    previousEpisodeId?: string;
    episodeNumber?: number;
    storylineContext?: string;
  }
): string {
  if (!continuityContext) {
    return '';
  }

  let instructions = 'CONTINUITY REQUIREMENTS:\n';
  
  if (continuityContext.episodeNumber) {
    instructions += `- This is episode ${continuityContext.episodeNumber} in a series\n`;
  }
  
  if (continuityContext.storylineContext) {
    instructions += `- Previous context: ${continuityContext.storylineContext}\n`;
    instructions += '- Maintain narrative continuity with previous episodes\n';
    instructions += '- Reference previous events naturally without over-explaining\n';
  }

  return instructions;
}

/**
 * Build prompt for Italian language specification
 */
export function buildItalianLanguageSpec(): string {
  return `LANGUAGE REQUIREMENTS:
- Write entirely in Italian
- Use natural, authentic Italian (not textbook Italian)
- Include appropriate cultural context and references
- Use appropriate register (conversational, not overly formal unless context requires)`;
}
