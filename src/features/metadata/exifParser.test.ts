import { describe, it, expect } from 'vitest';
import { parseMediaMetadata, formatCaptureDate } from './exifParser';

describe('EXIF & Media Metadata Parser', () => {
  it('should parse creation timestamp into ISO format', () => {
    const rawItem = {
      id: 'asset-test-1',
      uri: 'file:///photo.jpg',
      creationTime: 1704067200000, // 2024-01-01T00:00:00.000Z
      width: 4000,
      height: 3000,
    };

    const metadata = parseMediaMetadata(rawItem);

    expect(metadata.assetId).toBe('asset-test-1');
    expect(metadata.capturedAt).toBe('2024-01-01T00:00:00.000Z');
    expect(metadata.width).toBe(4000);
    expect(metadata.height).toBe(3000);
  });

  it('should infer city and country when GPS coordinates match a known area', () => {
    const rawItem = {
      id: 'asset-rome-1',
      uri: 'file:///rome.jpg',
      location: {
        latitude: 41.9028,
        longitude: 12.4964,
      },
    };

    const metadata = parseMediaMetadata(rawItem);

    expect(metadata.locationCity).toBe('Roma');
    expect(metadata.locationCountry).toBe('Italia');
  });

  it('should format ISO dates into friendly localized string', () => {
    const formatted = formatCaptureDate('2024-05-15T14:30:00.000Z');
    expect(formatted).toBeDefined();
    expect(formatted).not.toBe('Fecha desconocida');
  });
});
