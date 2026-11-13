import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlbumService, IAlbumRepository } from './albumService';
import { Asset, Album } from '../../../core/database/types';

describe('AlbumService (Zero-Duplication Virtual Routes)', () => {
  let mockRepo: IAlbumRepository;
  let albumService: AlbumService;

  beforeEach(() => {
    mockRepo = {
      createAlbum: vi.fn(),
      getAlbums: vi.fn(),
      getAssetsByAlbum: vi.fn(),
      getAssetsByTag: vi.fn(),
      getAssetRoutes: vi.fn(),
    };
    albumService = new AlbumService(mockRepo);
  });

  it('should list all virtual albums', async () => {
    const mockAlbums: Album[] = [
      { id: 'alb-1', title: 'Viaje a Italia 2024', createdAt: '2026-01-01' },
      { id: 'alb-2', title: 'Fotos con Mamá', createdAt: '2026-01-02' },
    ];
    vi.mocked(mockRepo.getAlbums).mockResolvedValue(mockAlbums);

    const result = await albumService.listAlbums();
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Viaje a Italia 2024');
  });

  it('should verify that a single asset is accessible in both "Viaje a Italia" and "Fotos con Mamá"', async () => {
    vi.mocked(mockRepo.getAssetRoutes).mockResolvedValue({
      albums: ['Viaje a Italia 2024', 'Fotos con Mamá'],
      tags: ['Mamá', 'Comida', 'Plaza Roma'],
    });

    const routes = await albumService.getCrossReferences('photo-italy-mama-1');

    expect(routes.albums).toContain('Viaje a Italia 2024');
    expect(routes.albums).toContain('Fotos con Mamá');
    expect(routes.tags).toContain('Mamá');
  });
});
