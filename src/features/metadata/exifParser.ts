import { AssetMetadata } from '../../core/database/types';

export interface RawMediaItem {
  id: string;
  uri: string;
  creationTime?: number; // timestamp in ms
  modificationTime?: number;
  width?: number;
  height?: number;
  duration?: number;
  location?: {
    latitude: number;
    longitude: number;
  } | null;
}

/**
 * Extracts and normalizes metadata from a native media asset.
 */
export function parseMediaMetadata(item: RawMediaItem): AssetMetadata {
  const capturedAt = item.creationTime
    ? new Date(item.creationTime).toISOString()
    : new Date().toISOString();

  let locationCity: string | null = null;
  let locationCountry: string | null = null;

  // Simple reverse-geocode approximation for known landmark coordinates (can be wired to free geocoding API)
  if (item.location) {
    const lat = item.location.latitude;
    const lon = item.location.longitude;

    // Approximate bounding box for Rome/Italy as example
    if (lat >= 41.7 && lat <= 42.1 && lon >= 12.3 && lon <= 12.7) {
      locationCity = 'Roma';
      locationCountry = 'Italia';
    } else if (lat >= 4.5 && lat <= 4.8 && lon >= -74.2 && lon <= -73.9) {
      locationCity = 'Bogotá';
      locationCountry = 'Colombia';
    }
  }

  return {
    assetId: item.id,
    capturedAt,
    latitude: item.location?.latitude ?? null,
    longitude: item.location?.longitude ?? null,
    locationCity,
    locationCountry,
    width: item.width ?? null,
    height: item.height ?? null,
    durationSeconds: item.duration ?? null,
    aiDescription: null,
  };
}

/**
 * Formats captured timestamp into a user-friendly Spanish date string
 */
export function formatCaptureDate(isoString?: string | null): string {
  if (!isoString) return 'Fecha desconocida';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Fecha desconocida';
  }
}
