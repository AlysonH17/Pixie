import { Asset, TriageDecision, TriageStatus } from '../../../core/database/types';

export interface ITriageRepository {
  getAssetById(id: string): Promise<Asset | null>;
  getPendingAssets(limit?: number): Promise<Asset[]>;
  getUnclassifiedSavedAssets(limit?: number): Promise<Asset[]>;
  saveAssets(assets: Asset[]): Promise<void>;
  updateAssetStatus(id: string, status: TriageStatus, processedAt: string): Promise<void>;
  assignTagsToAsset(assetId: string, tagIds: string[], isAiSuggested?: boolean): Promise<void>;
  assignAssetToAlbums(assetId: string, albumIds: string[]): Promise<void>;
  recordHistory(assetId: string, action: string, timestamp: string): Promise<void>;
  deleteLatestHistoryEntry(assetId: string): Promise<void>;
  countPendingNew(): Promise<number>;
  countUnclassifiedSaved(): Promise<number>;
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
   * It is marked as 'discarded' and moved to the retention/trash queue.
   */
  async discardAsset(assetId: string, now: Date = new Date()): Promise<void> {
    const timestamp = now.toISOString();
    await this.repo.updateAssetStatus(assetId, 'discarded', timestamp);
    await this.repo.recordHistory(assetId, 'DISCARD', timestamp);
  }

  /**
   * Quick-Keep (Modo Limpieza Rápida):
   * Saves the asset from trash without forcing immediate tagging.
   * Marked as 'kept_unclassified' so it can be tagged later when desired.
   */
  async quickKeepAsset(assetId: string, now: Date = new Date()): Promise<void> {
    const timestamp = now.toISOString();
    await this.repo.updateAssetStatus(assetId, 'kept_unclassified', timestamp);
    await this.repo.recordHistory(assetId, 'QUICK_KEEP', timestamp);
  }

  /**
   * Detailed-Keep (Modo Clasificación Detallada):
   * Saves the asset and associates tags/albums without duplicating file bytes.
   * Marked as 'kept_classified'.
   */
  async detailedKeepAsset(decision: TriageDecision, now: Date = new Date()): Promise<void> {
    const timestamp = now.toISOString();
    await this.repo.updateAssetStatus(decision.assetId, 'kept_classified', timestamp);

    if (decision.tagIds && decision.tagIds.length > 0) {
      await this.repo.assignTagsToAsset(decision.assetId, decision.tagIds);
    }

    if (decision.albumIds && decision.albumIds.length > 0) {
      await this.repo.assignAssetToAlbums(decision.assetId, decision.albumIds);
    }

    await this.repo.recordHistory(decision.assetId, 'DETAILED_KEEP', timestamp);
  }

  /**
   * Undoes the last triage decision for a given asset.
   */
  async undoDecision(assetId: string): Promise<void> {
    await this.repo.updateAssetStatus(assetId, 'pending', '');
    await this.repo.deleteLatestHistoryEntry(assetId);
  }
}
