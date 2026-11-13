import { Album, Asset } from '../../../core/database/types';

export interface IAlbumRepository {
  createAlbum(id: string, title: string, description?: string): Promise<Album>;
  getAlbums(): Promise<Album[]>;
  getAssetsByAlbum(albumId: string): Promise<Asset[]>;
  getAssetsByTag(tagId: string): Promise<Asset[]>;
  getAssetRoutes(assetId: string): Promise<{ albums: string[]; tags: string[] }>;
}

export class AlbumService {
  constructor(private repo: IAlbumRepository) {}

  /**
   * Retrieves all albums available.
   */
  async listAlbums(): Promise<Album[]> {
    return this.repo.getAlbums();
  }

  /**
   * Finds assets inside a virtual album without checking physical duplicates.
   */
  async getAlbumContents(albumId: string): Promise<Asset[]> {
    return this.repo.getAssetsByAlbum(albumId);
  }

  /**
   * Verifies that a given asset is reachable across multiple paths/routes (e.g. Mama + Italia).
   */
  async getCrossReferences(assetId: string): Promise<{ albums: string[]; tags: string[] }> {
    return this.repo.getAssetRoutes(assetId);
  }
}
