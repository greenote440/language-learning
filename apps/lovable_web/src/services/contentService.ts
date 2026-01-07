// Content Service - Handles content generation API calls

export interface UserPreferences {
  difficultyPreference?: 'beginner' | 'intermediate' | 'advanced';
  preferredFormats?: ('narrative' | 'podcast' | 'educational')[];
  preferredGenres?: string[];
  autoPlay?: boolean;
  playbackSpeed?: number;
}

export interface ContentGenerationRequest {
  sessionId: string;
  userPreferences?: UserPreferences;
  adaptationSignals?: {
    preferredFormats?: ('narrative' | 'podcast' | 'educational')[];
    preferredGenres?: string[];
    difficultyAdjustment?: number;
  };
  continuityContext?: {
    previousEpisodeId?: string;
    episodeNumber?: number;
    storylineContext?: string;
  };
  webhookUrl?: string;
}

export interface ContentGenerationResponse {
  generationId: string;
  status: 'generating' | 'processing' | 'completed' | 'failed';
  estimatedCompletionTime?: number;
  webhookRegistered?: boolean;
}

export interface GenerationStatusResponse {
  status: 'generating' | 'processing' | 'completed' | 'failed';
  content?: Content;
  error?: string;
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  textContent: string;
  audioUrl?: string; // Optional for mock mode
  format: 'narrative' | 'podcast' | 'educational';
  genre?: string;
  difficulty: 'lexical-heavy' | 'discourse-heavy';
  duration: number;
  sessionId: string;
  episodeNumber?: number;
  generatedAt?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const USE_MOCK_SERVICE = import.meta.env.VITE_USE_MOCK_SERVICE === 'true' || true; // Default to true for now

// Mock content templates
const MOCK_CONTENT_TEMPLATES = {
  narrative: [
    {
      title: 'Il Giardino Segreto',
      description: 'Una storia di scoperta e amicizia',
      textContent: 'C\'era una volta un giardino segreto, nascosto dietro un muro di pietra antica. Maria lo scoprì per caso, mentre esplorava la grande casa di suo zio. Il giardino era abbandonato da anni, ma Maria sentiva che c\'era qualcosa di magico in quel posto. Ogni giorno, tornava al giardino con i suoi nuovi amici, e insieme iniziarono a prendersi cura delle piante. Lentamente, il giardino tornò in vita, e con esso, anche i loro cuori.',
    },
    {
      title: 'Il Viaggio di Marco',
      description: 'Un\'avventura attraverso l\'Italia',
      textContent: 'Marco partì da Milano con solo uno zaino e tanta curiosità. Il suo obiettivo era raggiungere Roma a piedi, attraversando le colline toscane e i piccoli borghi medievali. Lungo la strada, incontrò persone gentili che gli offrirono cibo e riparo. Ogni sera, seduto in una piazza o su una panchina, scriveva nel suo diario le esperienze del giorno. Il viaggio non era solo un percorso geografico, ma un viaggio dentro se stesso.',
    },
    {
      title: 'La Bottega del Nonno',
      description: 'Memorie di un artigiano',
      textContent: 'Nella piccola bottega di legno, il nonno lavorava ogni giorno. Le sue mani, rugose e sapienti, creavano oggetti meravigliosi: scatole intarsiate, giocattoli di legno, mobili che duravano generazioni. Io, da bambino, passavo ore a guardarlo lavorare, affascinato dalla precisione dei suoi movimenti. "Il segreto", mi diceva, "è amare ciò che fai e farlo con pazienza". Quelle parole mi sono rimaste nel cuore.',
    },
  ],
  podcast: [
    {
      title: 'Storia d\'Italia: Il Rinascimento',
      description: 'Un approfondimento sulla cultura italiana',
      textContent: 'Benvenuti a questo episodio del nostro podcast sulla storia italiana. Oggi parleremo del Rinascimento, uno dei periodi più affascinanti della storia europea. Il Rinascimento italiano iniziò nel quattordicesimo secolo e raggiunse il suo apice nel sedicesimo secolo. Fu un periodo di grande innovazione artistica, scientifica e culturale. Artisti come Leonardo da Vinci, Michelangelo e Raffaello crearono capolavori che ancora oggi ammiriamo. Le città italiane come Firenze, Venezia e Roma divennero centri di cultura e commercio.',
    },
    {
      title: 'Cucina Italiana: La Pasta',
      description: 'Tradizioni e segreti della pasta italiana',
      textContent: 'In questo episodio esploriamo il mondo della pasta italiana. La pasta è uno degli alimenti più amati al mondo, e l\'Italia ne è la patria. Ogni regione italiana ha le sue specialità: dalla carbonara romana alle orecchiette pugliesi, dai tortellini emiliani agli spaghetti alle vongole napoletani. La pasta non è solo cibo, è cultura, tradizione, famiglia. Ogni ricetta racconta una storia, ogni formato ha la sua origine. Impariamo insieme i segreti per preparare una pasta perfetta.',
    },
    {
      title: 'Viaggi in Italia: Le Cinque Terre',
      description: 'Guida turistica alle Cinque Terre',
      textContent: 'Le Cinque Terre sono uno dei luoghi più spettacolari d\'Italia. Cinque piccoli villaggi colorati arroccati sulle scogliere della Liguria, collegati da sentieri panoramici e una ferrovia pittoresca. Ogni villaggio ha il suo carattere: Monterosso con le sue spiagge, Vernazza con il porticciolo, Corniglia in alto sulla scogliera, Manarola con le sue case colorate, e Riomaggiore che si affaccia sul mare. Visitare le Cinque Terre significa immergersi in un paesaggio unico, dove natura e cultura si fondono.',
    },
  ],
  educational: [
    {
      title: 'Lezione di Italiano: I Verbi Regolari',
      description: 'Impara a coniugare i verbi regolari',
      textContent: 'Oggi studiamo i verbi regolari italiani. I verbi regolari seguono schemi precisi nella coniugazione. Prendiamo come esempio il verbo "parlare", che significa "to speak". All\'indicativo presente: io parlo, tu parli, lui/lei parla, noi parliamo, voi parlate, loro parlano. Notate come la desinenza cambia a seconda della persona. I verbi italiani si dividono in tre coniugazioni: -are, -ere, -ire. Ogni coniugazione ha le sue regole, ma una volta imparate, potrete coniugare centinaia di verbi.',
    },
    {
      title: 'Grammatica: Gli Articoli',
      description: 'Guida completa agli articoli italiani',
      textContent: 'Gli articoli in italiano sono molto importanti. Ci sono articoli determinativi: il, lo, la, i, gli, le. E articoli indeterminativi: un, uno, una. L\'uso dell\'articolo dipende dal genere e dal numero del sostantivo. Per esempio: "il libro" è maschile singolare, "la casa" è femminile singolare, "i libri" è maschile plurale, "le case" è femminile plurale. Gli articoli aiutano a identificare e specificare i sostantivi nella frase. È fondamentale impararli bene per parlare italiano correttamente.',
    },
    {
      title: 'Vocabolario: Al Ristorante',
      description: 'Frasi utili per ordinare al ristorante',
      textContent: 'Imparare a ordinare al ristorante è essenziale quando si viaggia in Italia. Ecco alcune frasi utili: "Buonasera, avete un tavolo per due?" per chiedere un tavolo. "Posso vedere il menu?" per vedere il menu. "Vorrei un\'antipasto" per ordinare un antipasto. "Come primo piatto, prendo gli spaghetti" per il primo piatto. "E come secondo?" per chiedere il secondo. "Un caffè, per favore" per ordinare un caffè. "Il conto, per favore" per chiedere il conto. Con queste frasi sarete pronti per una cena in un ristorante italiano!',
    },
  ],
};

// Generate mock audio URL (using a placeholder or sample audio)
const generateMockAudioUrl = (contentId: string): string | undefined => {
  // In mock mode, make audio optional - return undefined to skip audio
  // This allows testing the UI without audio playback issues
  if (USE_MOCK_SERVICE) {
    return undefined; // No audio in mock mode - UI can be tested without it
  }
  
  // In production, this would be an S3/CDN URL
  return 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav';
};

// Generate mock content
const generateMockContent = (
  request: ContentGenerationRequest,
  format?: 'narrative' | 'podcast' | 'educational'
): Content => {
  const selectedFormat = format || 
    request.userPreferences?.preferredFormats?.[0] ||
    (['narrative', 'podcast', 'educational'] as const)[Math.floor(Math.random() * 3)];
  
  const templates = MOCK_CONTENT_TEMPLATES[selectedFormat];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const contentId = `content-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const duration = 60 + Math.floor(Math.random() * 120); // 60-180 seconds
  
  return {
    id: contentId,
    title: template.title,
    description: template.description,
    textContent: template.textContent,
    audioUrl: generateMockAudioUrl(contentId),
    format: selectedFormat,
    difficulty: request.userPreferences?.difficultyPreference === 'advanced' ? 'discourse-heavy' : 'lexical-heavy',
    duration,
    sessionId: request.sessionId,
    episodeNumber: undefined,
    generatedAt: new Date().toISOString(),
  };
};

class ContentService {
  /**
   * Generate new content
   */
  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    // Use mock service if enabled
    if (USE_MOCK_SERVICE) {
      const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      // Simulate async generation with a delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000)); // 1.5-2.5 seconds
      
      return {
        generationId,
        status: 'completed',
        estimatedCompletionTime: 2000,
        webhookRegistered: false,
      };
    }

    // Real API call
    const response = await fetch(`${API_BASE_URL}/api/content/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json().catch(() => ({ error: { message: 'Bad request' } }));
        throw new Error(error.error?.message || 'Invalid request');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(`Failed to generate content: ${response.statusText}`);
    }

    if (response.status === 202) {
      return await response.json();
    }

    throw new Error(`Unexpected response status: ${response.status}`);
  }

  /**
   * Poll generation status
   */
  async getGenerationStatus(generationId: string, request?: ContentGenerationRequest): Promise<GenerationStatusResponse> {
    // Use mock service if enabled
    if (USE_MOCK_SERVICE) {
      // Extract format from request if available
      const format = request?.userPreferences?.preferredFormats?.[0] as 'narrative' | 'podcast' | 'educational' | undefined;
      
      // Generate mock content
      if (request) {
        const content = generateMockContent(request, format);
        return {
          status: 'completed',
          content,
        };
      }
      
      // If no request provided, return generating status (shouldn't happen in normal flow)
      return {
        status: 'generating',
      };
    }

    // Real API call
    const response = await fetch(`${API_BASE_URL}/api/content/${generationId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Generation not found');
      }
      throw new Error(`Failed to get generation status: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get content by ID
   */
  async getContent(contentId: string): Promise<Content> {
    const response = await fetch(`${API_BASE_URL}/api/content/${contentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Content not found');
      }
      throw new Error(`Failed to get content: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Poll generation status until completed or failed
   * Returns the content when completed, or throws an error if failed
   */
  async pollUntilComplete(
    generationId: string,
    options: {
      pollInterval?: number; // milliseconds between polls
      maxDuration?: number; // maximum polling duration in milliseconds
      onStatusUpdate?: (status: GenerationStatusResponse) => void;
      request?: ContentGenerationRequest; // Original request for mock mode
    } = {}
  ): Promise<Content> {
    const {
      pollInterval = 2000, // 2 seconds default
      maxDuration = 30000, // 30 seconds default
      onStatusUpdate,
      request,
    } = options;

    // Use mock service if enabled
    if (USE_MOCK_SERVICE && request) {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000)); // 0.5-1.5 seconds
      
      // Notify status updates
      onStatusUpdate?.({ status: 'generating' });
      await new Promise(resolve => setTimeout(resolve, 500));
      onStatusUpdate?.({ status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate and return mock content
      const format = request.userPreferences?.preferredFormats?.[0] as 'narrative' | 'podcast' | 'educational' | undefined;
      const content = generateMockContent(request, format);
      onStatusUpdate?.({ status: 'completed', content });
      return content;
    }

    // Real API polling
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          // Check timeout
          if (Date.now() - startTime > maxDuration) {
            reject(new Error('Content generation timeout'));
            return;
          }

          const status = await this.getGenerationStatus(generationId, request);
          
          // Notify status update
          onStatusUpdate?.(status);

          if (status.status === 'completed' && status.content) {
            resolve(status.content);
            return;
          }

          if (status.status === 'failed') {
            reject(new Error(status.error || 'Content generation failed'));
            return;
          }

          // Still generating or processing, poll again
          setTimeout(poll, pollInterval);
        } catch (error) {
          reject(error);
        }
      };

      // Start polling
      poll();
    });
  }
}

export const contentService = new ContentService();
