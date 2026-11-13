import { Asset, TriageDecision, TriageStatus, Tag, Album } from '../../../core/database/types';

export interface ITriageRepository {
  getAssetById(id: string): Promise<Asset | null>;
  getPendingAssets(limit?: number): Promise<Asset[]>;
  saveAssets(assets: Asset[]): Promise<void>;
  updateAssetStatus(id: string, status: TriageStatus, processedAt: string): Promise<void>;
  assignTagsToAsset(assetId: string, tagIds: string[], isAiSuggested?: boolean): Promise<void>;
  assignAssetToAlbums(assetId: string, albumIds: string[]): Promise<void>;
  recordHistory(assetId: string, action: string, timestamp: string): Promise<void>;
  deleteLatestHistoryEntry(assetId: string): Promise<void>;
}

export class TriageManager {
  constructor(private repo: ITriageRepository) {}

  /**
   * Filters incoming assets from the device camera roll,
   * returning only those that have NEVER been classified before.
   */
  filterUnprocessedAssets(deviceAssets: Asset[], existingProcessedIds: Set<string>): Asset[] {
    return deviceAssets.filter((asset) => !existingProcessedIds.has(asset.id));
  }

  /**
   * Discards an asset (swiped left).
   * It is marked as 'discarded' and added to the trash queue.
   */
  async discardAsset(assetId: string, now: Date = new Date()): Promise<void> {
    const timestamp = now.toISOString();
    await this.repo.updateAssetStatus(assetId, 'discarded', timestamp);
    await this.repo.recordHistory(assetId, 'DISCARD', timestamp);
  }

  /**
   * Keeps an asset (swiped right) and tags it across multiple virtual routes.
   * File bytes are never duplicated.
   */
  async keepAsset(decision: TriageDecision, now: Date = new Date()): Promise<void> {
    const timestamp = now.toISOString();
    await this.repo.updateAssetStatus(decision.assetId, 'kept', timestamp);

    if (decision.tagIds && decision.tagIds.length > 0) {
      await this.repo.assignTagsToAsset(decision.assetId, decision.tagIds);
    }

    if (decision.albumIds && decision.albumIds.length > 0) {
      await this.repo.assignAssetToAlbums(decision.assetId, decision.albumIds);
    }

    await this.repo.recordHistory(decision.assetId, 'KEEP', timestamp);
  }

  /**
   * Undoes the last triage decision for a given asset.
   */
  async undoDecision(assetId: string): Promise<void> {
    await this.repo.updateAssetStatus(assetId, 'pending', '');
    await this.repo.deleteLatestHistoryEntry(assetId);
  }
}
