import { SQLiteDatabase } from 'expo-sqlite';
import { ITriageRepository } from '../domain/triageManager';
import { Asset, TriageStatus } from '../../../core/database/types';

export class SQLiteTriageRepository implements ITriageRepository {
  constructor(private db: SQLiteDatabase) {}

  async getAssetById(id: string): Promise<Asset | null> {
    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM assets WHERE id = ?;',
      [id]
    );
    if (!row) return null;
    return this.mapRowToAsset(row);
  }

  async getPendingAssets(limit: number = 50): Promise<Asset[]> {
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM assets WHERE triage_status = "pending" ORDER BY created_at DESC LIMIT ?;',
      [limit]
    );
    return rows.map(this.mapRowToAsset);
  }

  async saveAssets(assets: Asset[]): Promise<void> {
    for (const a of assets) {
      await this.db.runAsync(
        `INSERT OR IGNORE INTO assets (id, uri, media_type, file_size_bytes, triage_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [a.id, a.uri, a.mediaType, a.fileSizeBytes, a.triageStatus, a.createdAt]
      );
    }
  }

  async updateAssetStatus(id: string, status: TriageStatus, processedAt: string): Promise<void> {
    await this.db.runAsync(
      'UPDATE assets SET triage_status = ?, processed_at = ? WHERE id = ?;',
      [status, processedAt, id]
    );
  }

  async assignTagsToAsset(assetId: string, tagIds: string[], isAiSuggested: boolean = false): Promise<void> {
    for (const tagId of tagIds) {
      await this.db.runAsync(
        'INSERT OR IGNORE INTO asset_tags (asset_id, tag_id, is_ai_suggested) VALUES (?, ?, ?);',
        [assetId, tagId, isAiSuggested ? 1 : 0]
      );
    }
  }

  async assignAssetToAlbums(assetId: string, albumIds: string[]): Promise<void> {
    const now = new Date().toISOString();
    for (const albumId of albumIds) {
      await this.db.runAsync(
        'INSERT OR IGNORE INTO album_assets (album_id, asset_id, added_at) VALUES (?, ?, ?);',
        [albumId, assetId, now]
      );
    }
  }

  async recordHistory(assetId: string, action: string, timestamp: string): Promise<void> {
    const historyId = `${assetId}-${Date.now()}`;
    await this.db.runAsync(
      'INSERT INTO triage_history (id, asset_id, action, timestamp) VALUES (?, ?, ?, ?);',
      [historyId, assetId, action, timestamp]
    );
  }

  async deleteLatestHistoryEntry(assetId: string): Promise<void> {
    await this.db.runAsync(
      'DELETE FROM triage_history WHERE id IN (SELECT id FROM triage_history WHERE asset_id = ? ORDER BY timestamp DESC LIMIT 1);',
      [assetId]
    );
  }

  async getProcessedAssetIds(): Promise<Set<string>> {
    const rows = await this.db.getAllAsync<{ id: string }>(
      'SELECT id FROM assets WHERE triage_status != "pending";'
    );
    return new Set(rows.map((r) => r.id));
  }

  private mapRowToAsset(row: any): Asset {
    return {
      id: row.id,
      uri: row.uri,
      mediaType: row.media_type,
      fileSizeBytes: row.file_size_bytes,
      triageStatus: row.triage_status,
      createdAt: row.created_at,
      processedAt: row.processed_at,
    };
  }
}
