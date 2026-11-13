import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { theme } from '../../../core/theme';
import { Asset, AssetMetadata } from '../../../core/database/types';
import { formatCaptureDate } from '../../metadata/exifParser';

interface TaggingModalProps {
  visible: boolean;
  asset: Asset | null;
  metadata?: AssetMetadata | null;
  aiSuggestion?: {
    category?: string;
    tags?: string[];
    album?: string;
  } | null;
  onSave: (tagIds: string[], albumTitles: string[]) => void;
  onCancel: () => void;
}

export const TaggingModal: React.FC<TaggingModalProps> = ({
  visible,
  asset,
  metadata,
  aiSuggestion,
  onSave,
  onCancel,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);

  // Pre-seed selections when AI gives strong suggestions
  React.useEffect(() => {
    if (aiSuggestion) {
      const initialTags: string[] = [];
      if (aiSuggestion.category) initialTags.push(aiSuggestion.category);
      if (aiSuggestion.tags) initialTags.push(...aiSuggestion.tags);
      setSelectedTags(initialTags);

      if (aiSuggestion.album) {
        setSelectedAlbums([aiSuggestion.album]);
      }
    }
  }, [aiSuggestion]);

  if (!asset) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleAlbum = (album: string) => {
    setSelectedAlbums((prev) =>
      prev.includes(album) ? prev.filter((a) => a !== album) : [...prev, album]
    );
  };

  const peopleOptions = ['Mamá', 'Amigos', 'Pareja', 'Yo'];
  const categoryOptions = ['Comida', 'Paisaje', 'Atardecer', 'Documento', 'Mascota'];
  const albumOptions = ['Viaje a Italia 2024', 'Familia', 'Favoritos 2026'];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Clasificar Fotografía</Text>
              <Text style={styles.subtitle}>
                Guárdala en múltiples rutas sin ocupar doble espacio
              </Text>
            </View>

            {/* Preview & EXIF defaults */}
            <View style={styles.previewContainer}>
              <Image source={{ uri: asset.uri }} style={styles.thumbnail} />
              <View style={styles.exifBadge}>
                <Text style={styles.exifLabel}>
                  📅 {formatCaptureDate(metadata?.capturedAt)}
                </Text>
                {metadata?.locationCity ? (
                  <Text style={styles.exifLabel}>
                    📍 {metadata.locationCity}, {metadata.locationCountry}
                  </Text>
                ) : (
                  <Text style={styles.exifLabel}>📍 Ubicación no disponible</Text>
                )}
                {aiSuggestion?.category && (
                  <View style={styles.aiTag}>
                    <Text style={styles.aiTagText}>
                      ✨ IA sugiere: {aiSuggestion.category}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* People chips */}
            <Text style={styles.sectionTitle}>Personas que aparecen:</Text>
            <View style={styles.chipsRow}>
              {peopleOptions.map((person) => {
                const isSelected = selectedTags.includes(person);
                return (
                  <TouchableOpacity
                    key={person}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleTag(person)}
                  >
                    <Text
                      style={[styles.chipText, isSelected && styles.chipTextSelected]}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {person}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Categories */}
            <Text style={styles.sectionTitle}>Categoría / Tema:</Text>
            <View style={styles.chipsRow}>
              {categoryOptions.map((cat) => {
                const isSelected = selectedTags.includes(cat);
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleTag(cat)}
                  >
                    <Text
                      style={[styles.chipText, isSelected && styles.chipTextSelected]}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Virtual Albums */}
            <Text style={styles.sectionTitle}>Álbumes Virtuales (Cero duplicación):</Text>
            <View style={styles.chipsRow}>
              {albumOptions.map((album) => {
                const isSelected = selectedAlbums.includes(album);
                return (
                  <TouchableOpacity
                    key={album}
                    style={[styles.chip, isSelected && styles.chipAlbumSelected]}
                    onPress={() => toggleAlbum(album)}
                  >
                    <Text
                      style={[styles.chipText, isSelected && styles.chipTextSelected]}
                    >
                      📁 {album}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => onSave(selectedTags, selectedAlbums)}
              >
                <Text style={styles.saveBtnText}>Guardar Foto</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '85%',
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  previewContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#334155',
  },
  exifBadge: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  exifLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  aiTag: {
    marginTop: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  aiTagText: {
    fontSize: 11,
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryLight,
  },
  chipAlbumSelected: {
    backgroundColor: '#059669', // Emerald for albums
    borderColor: '#34D399',
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
