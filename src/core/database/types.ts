export type TriageStatus = 'pending' | 'kept' | 'discarded' | 'deleted';
export type MediaType = 'image' | 'video';
export type TagType = 'person' | 'category' | 'event' | 'custom';

export interface Asset {
  id: string; // Unique hash or local asset ID
  uri: string;
  mediaType: MediaType;
  fileSizeBytes: number;
  triageStatus: TriageStatus;
  createdAt: string; // ISO date
  processedAt?: string | null;
}

export interface AssetMetadata {
  assetId: string;
  capturedAt?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationCity?: string | null;
  locationCountry?: string | null;
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
  aiDescription?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  type: TagType;
}

export interface Album {
  id: string;
  title: string;
  description?: string;
  coverAssetId?: string | null;
  createdAt: string;
}

export interface AssetTagRelation {
  assetId: string;
  tagId: string;
  isAiSuggested: boolean;
}

export interface AlbumAssetRelation {
  albumId: string;
  assetId: string;
  addedAt: string;
}

export interface TriageDecision {
  assetId: string;
  action: 'keep' | 'discard';
  tagIds?: string[];
  albumIds?: string[];
  metadata?: Partial<AssetMetadata>;
}
