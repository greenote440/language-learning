// Mock Content Service - Returns mock data for testing without API calls

import type { Content, ContentGenerationRequest, ContentGenerationResponse, GenerationStatusResponse } from './contentService';

// Mock Italian content samples
const MOCK_CONTENT: Content[] = [
  {
    id: 'mock-1',
    title: 'Il Caffè Italiano',
    description: 'Una breve storia sul caffè in Italia',
    textContent: 'Il caffè è una parte importante della cultura italiana. Ogni mattina, milioni di italiani bevono un espresso al bar. Il barista prepara il caffè con cura, usando macchine speciali. Il profumo del caffè riempie l\'aria. Gli italiani bevono il caffè velocemente, in piedi al bancone. È un momento sociale, un modo per iniziare la giornata.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    format: 'narrative',
    genre: 'cultura',
    difficulty: 'lexical-heavy',
    duration: 45,
    sessionId: 'mock-session',
    episodeNumber: 1,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'La Pasta Perfetta',
    description: 'Un podcast sulla pasta italiana',
    textContent: 'Benvenuti al podcast sulla pasta italiana. Oggi parliamo della pasta perfetta. La pasta è un alimento base della cucina italiana. Ci sono centinaia di forme diverse: spaghetti, penne, fusilli, farfalle. Ogni regione ha le sue specialità. La pasta deve essere cotta al dente, non troppo morbida. Il sugo deve essere semplice e saporito. La pasta è più di un cibo, è una tradizione.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    format: 'podcast',
    genre: 'cucina',
    difficulty: 'discourse-heavy',
    duration: 60,
    sessionId: 'mock-session',
    episodeNumber: 2,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'I Verbi Regolari',
    description: 'Lezione di grammatica italiana',
    textContent: 'Oggi studiamo i verbi regolari in italiano. I verbi regolari seguono un modello preciso. Prendiamo il verbo "parlare". Io parlo, tu parli, lui parla, noi parliamo, voi parlate, loro parlano. Notate come cambia la desinenza. I verbi in -are, -ere, e -ire seguono modelli simili. Praticate ogni giorno per migliorare.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    format: 'educational',
    genre: 'grammatica',
    difficulty: 'lexical-heavy',
    duration: 90,
    sessionId: 'mock-session',
    episodeNumber: 3,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    title: 'Il Colosseo di Roma',
    description: 'Storia del monumento più famoso d\'Italia',
    textContent: 'Il Colosseo è il simbolo di Roma. Costruito duemila anni fa, era il luogo dei giochi gladiatori. Migliaia di spettatori si riunivano per guardare. L\'anfiteatro è enorme, alto come un palazzo di dieci piani. Oggi è una delle attrazioni turistiche più visitate al mondo. Ogni anno, milioni di persone lo visitano. Il Colosseo racconta la storia dell\'antica Roma.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    format: 'narrative',
    genre: 'storia',
    difficulty: 'discourse-heavy',
    duration: 55,
    sessionId: 'mock-session',
    episodeNumber: 4,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    title: 'La Moda Italiana',
    description: 'Un podcast sulla moda italiana',
    textContent: 'Benvenuti a un nuovo episodio sul mondo della moda italiana. L\'Italia è famosa per la moda. Milano è la capitale della moda italiana. Designer famosi come Armani, Versace e Prada sono italiani. La moda italiana è elegante e raffinata. Combina tradizione e innovazione. Gli italiani amano vestirsi bene. La moda è arte, è espressione di personalità.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    format: 'podcast',
    genre: 'cultura',
    difficulty: 'lexical-heavy',
    duration: 70,
    sessionId: 'mock-session',
    episodeNumber: 5,
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-6',
    title: 'Gli Articoli Determinativi',
    description: 'Lezione sugli articoli in italiano',
    textContent: 'Oggi impariamo gli articoli determinativi. In italiano abbiamo: il, lo, la, i, gli, le. Usiamo "il" con nomi maschili singolari: il libro, il cane. Usiamo "la" con nomi femminili singolari: la casa, la strada. Al plurale: i libri, le case. Gli articoli cambiano anche per il suono: lo zaino, gli zaini. Praticate con molti esempi.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    format: 'educational',
    genre: 'grammatica',
    difficulty: 'lexical-heavy',
    duration: 50,
    sessionId: 'mock-session',
    episodeNumber: 6,
    generatedAt: new Date().toISOString(),
  },
];

// Additional mock content templates for generation
const MOCK_TEMPLATES = {
  narrative: [
    {
      title: 'Il Tramonto sul Mare',
      description: 'Una storia romantica sulla costa italiana',
      textContent: 'Il sole tramonta lentamente sul mare. I colori del cielo cambiano: arancione, rosa, viola. Le onde si infrangono dolcemente sulla spiaggia. Una coppia cammina mano nella mano. Il momento è perfetto, magico. Il mare è calmo, il vento è leggero. Questo è il momento più bello della giornata.',
    },
    {
      title: 'Il Mercato del Mattino',
      description: 'Una descrizione vivace del mercato italiano',
      textContent: 'Il mercato si anima all\'alba. I venditori preparano le bancarelle. Frutta fresca, verdura colorata, formaggi profumati. I clienti arrivano presto per i prodotti migliori. Le voci si mescolano, creando una sinfonia. "Quanto costa?" "È fresco?" "Posso assaggiare?" Il mercato è vita, è comunità.',
    },
  ],
  podcast: [
    {
      title: 'Viaggiare in Italia',
      description: 'Consigli per viaggiare in Italia',
      textContent: 'Benvenuti al podcast sui viaggi in Italia. Oggi parliamo di come viaggiare in questo bellissimo paese. L\'Italia ha tutto: montagne, mare, città d\'arte, piccoli borghi. Il treno è il modo migliore per spostarsi. Le città d\'arte come Firenze e Venezia sono imperdibili. Assaggiate la cucina locale, parlate con la gente. Buon viaggio!',
    },
    {
      title: 'La Musica Italiana',
      description: 'Storia della musica italiana',
      textContent: 'Oggi esploriamo la musica italiana. L\'Italia ha una ricca tradizione musicale. L\'opera è nata in Italia. Compositori come Verdi e Puccini sono famosi nel mondo. La musica pop italiana è vivace e melodiosa. Ogni regione ha le sue canzoni tradizionali. La musica unisce gli italiani.',
    },
  ],
  educational: [
    {
      title: 'I Numeri in Italiano',
      description: 'Impara i numeri da 1 a 100',
      textContent: 'Oggi contiamo in italiano. Uno, due, tre, quattro, cinque. I numeri sono importanti. Dieci, venti, trenta, quaranta, cinquanta. Notate come si formano i numeri composti: ventuno, ventidue, trentatré. Cento, duecento, trecento. Praticate contando oggetti intorno a voi. I numeri sono ovunque!',
    },
    {
      title: 'Le Preposizioni',
      description: 'Uso delle preposizioni in italiano',
      textContent: 'Studiamo le preposizioni: di, a, da, in, con, su, per, tra, fra. "Di" indica possesso: il libro di Maria. "A" indica direzione: vado a scuola. "In" indica luogo: sono in casa. "Con" indica compagnia: vado con amici. Ogni preposizione ha usi specifici. Praticate con frasi.',
    },
  ],
};

let mockContentCounter = MOCK_CONTENT.length;

/**
 * Generate a new mock content item
 */
function generateMockContent(
  request: ContentGenerationRequest,
  episodeNumber: number
): Content {
  const formats: ('narrative' | 'podcast' | 'educational')[] = ['narrative', 'podcast', 'educational'];
  const selectedFormat = request.userPreferences?.preferredFormats?.[0] || 
    formats[Math.floor(Math.random() * formats.length)];
  
  const templates = MOCK_TEMPLATES[selectedFormat];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  mockContentCounter++;
  
  // Use reliable test MP3 URLs - SoundHelix provides working MP3 files
  const testAudioUrls = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  ];
  const audioIndex = (mockContentCounter - MOCK_CONTENT.length) % testAudioUrls.length;
  const audioUrl = testAudioUrls[audioIndex] || testAudioUrls[0];
  
  return {
    id: `mock-${mockContentCounter}`,
    title: template.title,
    description: template.description,
    textContent: template.textContent,
    audioUrl,
    format: selectedFormat,
    genre: selectedFormat === 'narrative' ? 'storia' : selectedFormat === 'podcast' ? 'cultura' : 'grammatica',
    difficulty: request.userPreferences?.difficultyPreference === 'advanced' ? 'discourse-heavy' : 'lexical-heavy',
    duration: 45 + Math.floor(Math.random() * 60), // 45-105 seconds
    sessionId: request.sessionId,
    episodeNumber,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Mock Content Service - Simulates API calls with delays
 */
export class MockContentService {
  private generationStatuses = new Map<string, { status: 'generating' | 'processing' | 'completed' | 'failed'; content?: Content }>();

  /**
   * Generate new content (mock)
   */
  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const episodeNumber = request.continuityContext?.episodeNumber || 1;
    
    // Generate mock content
    const content = generateMockContent(request, episodeNumber);
    
    // Store generation status
    this.generationStatuses.set(generationId, {
      status: 'generating',
      content: undefined,
    });
    
    // Simulate async generation process
    setTimeout(() => {
      this.generationStatuses.set(generationId, {
        status: 'processing',
        content: undefined,
      });
      
      setTimeout(() => {
        this.generationStatuses.set(generationId, {
          status: 'completed',
          content,
        });
      }, 1000);
    }, 500);
    
    return {
      generationId,
      status: 'generating',
      estimatedCompletionTime: 2000,
      webhookRegistered: false,
    };
  }

  /**
   * Get generation status (mock)
   */
  async getGenerationStatus(generationId: string): Promise<GenerationStatusResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const status = this.generationStatuses.get(generationId);
    
    if (!status) {
      throw new Error('Generation not found');
    }
    
    if (status.status === 'completed' && status.content) {
      return {
        status: 'completed',
        content: status.content,
      };
    }
    
    return {
      status: status.status,
    };
  }

  /**
   * Get content by ID (mock)
   */
  async getContent(contentId: string): Promise<Content> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check if it's a mock content ID
    const mockContent = MOCK_CONTENT.find(c => c.id === contentId);
    if (mockContent) {
      return mockContent;
    }
    
    // Check generation statuses
    for (const [_, status] of this.generationStatuses) {
      if (status.content?.id === contentId) {
        return status.content;
      }
    }
    
    throw new Error('Content not found');
  }

  /**
   * Poll until complete (mock)
   */
  async pollUntilComplete(
    generationId: string,
    options: {
      pollInterval?: number;
      maxDuration?: number;
      onStatusUpdate?: (status: GenerationStatusResponse) => void;
    } = {}
  ): Promise<Content> {
    const {
      pollInterval = 2000,
      maxDuration = 30000,
      onStatusUpdate,
    } = options;

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          if (Date.now() - startTime > maxDuration) {
            reject(new Error('Content generation timeout'));
            return;
          }

          const status = await this.getGenerationStatus(generationId);
          onStatusUpdate?.(status);

          if (status.status === 'completed' && status.content) {
            resolve(status.content);
            return;
          }

          if (status.status === 'failed') {
            reject(new Error(status.error || 'Content generation failed'));
            return;
          }

          setTimeout(poll, pollInterval);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Get initial mock content for testing
   */
  getInitialMockContent(): Content[] {
    return MOCK_CONTENT.slice(0, 3); // Return first 3 items
  }
}

export const mockContentService = new MockContentService();
