import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TriageManager, ITriageRepository } from './triageManager';
import { Asset } from '../../../core/database/types';

describe('TriageManager (Core Business Logic)', () => {
  let mockRepo: ITriageRepository;
  let triageManager: TriageManager;

  beforeEach(() => {
    mockRepo = {
      getAssetById: vi.fn(),
      getPendingAssets: vi.fn(),
      saveAssets: vi.fn(),
      updateAssetStatus: vi.fn(),
      assignTagsToAsset: vi.fn(),
      assignAssetToAlbums: vi.fn(),
      recordHistory: vi.fn(),
      deleteLatestHistoryEntry: vi.fn(),
    };
    triageManager = new TriageManager(mockRepo);
  });

  it('should exclude assets that have already been classified from the pending queue', () => {
    const deviceAssets: Asset[] = [
      { id: 'photo-1', uri: 'file://1.jpg', mediaType: 'image', fileSizeBytes: 1000, triageStatus: 'pending', createdAt: '2026-01-01' },
      { id: 'photo-2', uri: 'file://2.jpg', mediaType: 'image', fileSizeBytes: 2000, triageStatus: 'pending', createdAt: '2026-01-02' },
      { id: 'photo-3', uri: 'file://3.jpg', mediaType: 'image', fileSizeBytes: 3000, triageStatus: 'pending', createdAt: '2026-01-03' },
    ];

    // Suppose photo-1 was already kept, and photo-2 was discarded
    const processedIds = new Set(['photo-1', 'photo-2']);

    const queue = triageManager.filterUnprocessedAssets(deviceAssets, processedIds);

    expect(queue).toHaveLength(1);
    expect(queue[0].id).toBe('photo-3');
  });

  it('should discard an asset by marking status as discarded and logging history', async () => {
    const fixedDate = new Date('2026-11-13T10:00:00.000Z');
    await triageManager.discardAsset('photo-trash-1', fixedDate);

    expect(mockRepo.updateAssetStatus).toHaveBeenCalledWith('photo-trash-1', 'discarded', '2026-11-13T10:00:00.000Z');
    expect(mockRepo.recordHistory).toHaveBeenCalledWith('photo-trash-1', 'DISCARD', '2026-11-13T10:00:00.000Z');
  });

  it('should keep an asset and associate tags and virtual albums without duplicating file bytes', async () => {
    const fixedDate = new Date('2026-11-13T10:00:00.000Z');

    await triageManager.keepAsset(
      {
        assetId: 'photo-italy-mama',
        action: 'keep',
        tagIds: ['tag-mama', 'tag-comida'],
        albumIds: ['album-italia-2024', 'album-favoritos-mama'],
      },
      fixedDate
    );

    expect(mockRepo.updateAssetStatus).toHaveBeenCalledWith('photo-italy-mama', 'kept', '2026-11-13T10:00:00.000Z');
    expect(mockRepo.assignTagsToAsset).toHaveBeenCalledWith('photo-italy-mama', ['tag-mama', 'tag-comida']);
    expect(mockRepo.assignAssetToAlbums).toHaveBeenCalledWith('photo-italy-mama', ['album-italia-2024', 'album-favoritos-mama']);
    expect(mockRepo.recordHistory).toHaveBeenCalledWith('photo-italy-mama', 'KEEP', '2026-11-13T10:00:00.000Z');
  });

  it('should allow undoing a decision to return the photo to pending state', async () => {
    await triageManager.undoDecision('photo-123');

    expect(mockRepo.updateAssetStatus).toHaveBeenCalledWith('photo-123', 'pending', '');
    expect(mockRepo.deleteLatestHistoryEntry).toHaveBeenCalledWith('photo-123');
  });
});
