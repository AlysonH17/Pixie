export interface AiSuggestionResult {
  category: string;
  suggestedTags: string[];
  suggestedAlbum?: string;
  confidence: number;
  description: string;
}

export interface IAiVisionClient {
  analyzeImage(thumbnailBase64: string): Promise<AiSuggestionResult>;
  searchByDescription(query: string, availableDescriptions: { id: string; desc: string }[]): Promise<string[]>;
}

/**
 * Gemini Flash Vision Client (Multimodal)
 * Uses structured JSON output for sub-second tag suggestions.
 */
export class GeminiVisionClient implements IAiVisionClient {
  constructor(private apiKey?: string) {}

  async analyzeImage(thumbnailBase64: string): Promise<AiSuggestionResult> {
    if (!this.apiKey) {
      // Fallback/offline heuristic mode if no API key is provided
      return {
        category: 'General',
        suggestedTags: ['Reciente'],
        confidence: 0.5,
        description: 'Foto importada recientemente',
      };
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Analiza esta imagen y responde estrictamente en JSON con este esquema:
{
  "category": "Comida" | "Paisaje" | "Retrato" | "Mascota" | "Documento" | "Fiesta" | "Viaje" | "Otro",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "suggestedAlbum": "Nombre sugerido de álbum",
  "confidence": 0.95,
  "description": "Breve descripción visual de la escena para búsqueda semántica"
}`,
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: thumbnailBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Respuesta vacía de Gemini');

      return JSON.parse(rawText) as AiSuggestionResult;
    } catch (err) {
      console.warn('Fallo en GeminiVisionClient, usando fallback:', err);
      return {
        category: 'Sin clasificar',
        suggestedTags: [],
        confidence: 0,
        description: 'Sin descripción de IA',
      };
    }
  }

  async searchByDescription(
    query: string,
    availableDescriptions: { id: string; desc: string }[]
  ): Promise<string[]> {
    const qLower = query.toLowerCase();
    // Fast lexical + substring matching
    return availableDescriptions
      .filter((item) => item.desc.toLowerCase().includes(qLower))
      .map((item) => item.id);
  }
}
