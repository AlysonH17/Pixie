import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiVisionClient } from './geminiClient';

describe('GeminiVisionClient (Multimodal IA)', () => {
  let client: GeminiVisionClient;

  beforeEach(() => {
    client = new GeminiVisionClient('dummy-api-key');
  });

  it('should return fallback suggestion when no API key is set', async () => {
    const offlineClient = new GeminiVisionClient('');
    const result = await offlineClient.analyzeImage('base64thumb');

    expect(result.category).toBe('General');
    expect(result.confidence).toBe(0.5);
  });

  it('should search photos by natural language description', async () => {
    const descriptions = [
      { id: '1', desc: 'Foto de mamá en la Fontana di Trevi en Roma' },
      { id: '2', desc: 'Pizza margarita en un restaurante italiano' },
      { id: '3', desc: 'Atardecer en la playa con cielo naranja' },
    ];

    const results = await client.searchByDescription('Fontana di Trevi', descriptions);
    expect(results).toEqual(['1']);

    const foodResults = await client.searchByDescription('pizza', descriptions);
    expect(foodResults).toEqual(['2']);
  });
});
