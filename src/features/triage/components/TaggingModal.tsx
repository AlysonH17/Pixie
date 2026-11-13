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
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../core/theme';
import { Asset, AssetMetadata } from '../../../core/database/types';
import { formatCaptureDate } from '../../metadata/exifParser';

interface TaggingModalProps {
  visible: boolean;
  asset: Asset | null;
  metadata?: AssetMetadata | null;
  onSave: (tagIds: string[], albumTitles: string[]) => void;
  onCancel: () => void;
}

export const TaggingModal: React.FC<TaggingModalProps> = ({
  visible,
  asset,
  metadata,
  onSave,
  onCancel,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);

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
  const albumOptions = ['Viaje a Italia 2024', 'Familia', 'Favoritos'];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>Atributos de Fotografía</Text>
                <Text style={styles.subtitle}>
                  Organización multidimensional sin duplicar almacenamiento
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
                <Feather name="x" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Preview & Metadatos EXIF */}
            <View style={styles.previewContainer}>
              <Image source={{ uri: asset.uri }} style={styles.thumbnail} />
              <View style={styles.exifBadge}>
                <View style={styles.exifRow}>
                  <Feather name="calendar" size={13} color={theme.colors.textMuted} />
                  <Text style={styles.exifLabel}>
                    {formatCaptureDate(metadata?.capturedAt)}
                  </Text>
                </View>
                {metadata?.locationCity ? (
                  <View style={styles.exifRow}>
                    <Feather name="map-pin" size={13} color={theme.colors.textMuted} />
                    <Text style={styles.exifLabel}>
                      {metadata.locationCity}, {metadata.locationCountry}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.exifRow}>
                    <Feather name="map-pin" size={13} color={theme.colors.textMuted} />
                    <Text style={styles.exifLabel}>Ubicación no disponible</Text>
                  </View>
                )}
              </View>
            </View>

            {/* People chips */}
            <Text style={styles.sectionTitle}>Personas presentes</Text>
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
                      {person}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Categories */}
            <Text style={styles.sectionTitle}>Categoría temática</Text>
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
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Virtual Albums */}
            <Text style={styles.sectionTitle}>Álbumes asignados</Text>
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
                      {album}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => onSave(selectedTags, selectedAlbums)}
              >
                <Text style={styles.saveBtnText}>Guardar</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: theme.borderRadius.xs,
    backgroundColor: theme.colors.surfaceElevated,
  },
  previewContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: theme.borderRadius.xs,
    backgroundColor: '#1E2024',
  },
  exifBadge: {
    marginLeft: theme.spacing.md,
    flex: 1,
    gap: 4,
  },
  exifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exifLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    ...theme.typography.labelSmall,
    color: theme.colors.textMuted,
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
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  chipAlbumSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#0B0C0E',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelBtnText: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
    fontSize: 14,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#0B0C0E',
    fontWeight: '600',
    fontSize: 14,
  },
});
