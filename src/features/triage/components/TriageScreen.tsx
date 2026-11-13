import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { theme } from '../../../core/theme';
import { Asset, AssetMetadata } from '../../../core/database/types';
import { TaggingModal } from './TaggingModal';
import { parseMediaMetadata } from '../../metadata/exifParser';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TriageScreenProps {
  initialAssets: Asset[];
  onKeep: (assetId: string, tags: string[], albums: string[]) => void;
  onDiscard: (assetId: string) => void;
  onUndo?: () => void;
}

export const TriageScreen: React.FC<TriageScreenProps> = ({
  initialAssets,
  onKeep,
  onDiscard,
  onUndo,
}) => {
  const [queue, setQueue] = useState<Asset[]>(initialAssets);
  const [activeAsset, setActiveAsset] = useState<Asset | null>(
    initialAssets.length > 0 ? initialAssets[0] : null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [metadata, setMetadata] = useState<AssetMetadata | null>(null);
  const [keptCount, setKeptCount] = useState(0);
  const [discardedCount, setDiscardedCount] = useState(0);

  // Update active asset when queue changes
  React.useEffect(() => {
    if (queue.length > 0) {
      const current = queue[0];
      setActiveAsset(current);
      // Simulate EXIF parsing
      const parsed = parseMediaMetadata({
        id: current.id,
        uri: current.uri,
        creationTime: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
        location: { latitude: 41.9028, longitude: 12.4964 }, // Rome coordinates for demo
      });
      setMetadata(parsed);
    } else {
      setActiveAsset(null);
    }
  }, [queue]);

  const handleDiscardPress = () => {
    if (!activeAsset) return;
    const currentId = activeAsset.id;
    onDiscard(currentId);
    setDiscardedCount((c) => c + 1);
    setQueue((prev) => prev.slice(1));
  };

  const handleKeepPress = () => {
    if (!activeAsset) return;
    setModalVisible(true);
  };

  const handleSaveClassification = (tags: string[], albums: string[]) => {
    if (!activeAsset) return;
    onKeep(activeAsset.id, tags, albums);
    setKeptCount((c) => c + 1);
    setModalVisible(false);
    setQueue((prev) => prev.slice(1));
  };

  if (!activeAsset || queue.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>¡Todo al día!</Text>
          <Text style={styles.emptySubtitle}>
            No tienes más fotos pendientes por clasificar. Todas tus fotos nuevas
            han sido procesadas.
          </Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              ✅ Conservadas y clasificadas: <Text style={styles.bold}>{keptCount}</Text>
            </Text>
            <Text style={styles.summaryText}>
              🗑️ En cola de eliminación: <Text style={styles.bold}>{discardedCount}</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header & Counters */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brandTitle}>Pixie Triage</Text>
          <Text style={styles.counterText}>
            Pendientes en cola: <Text style={styles.bold}>{queue.length}</Text>
          </Text>
        </View>
        {onUndo && (
          <TouchableOpacity style={styles.undoBtn} onPress={onUndo}>
            <Text style={styles.undoText}>↩ Deshacer</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={{ uri: activeAsset.uri }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardFooter}>
            <Text style={styles.cardDate}>
              📅 {metadata?.locationCity ? `${metadata.locationCity} • ` : ''}
              {activeAsset.mediaType === 'video' ? '🎥 Video' : '📸 Foto'}
            </Text>
            <Text style={styles.cardHint}>
              ← Izquierda: Descartar | Derecha: Guardar →
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Swipe Triggers */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.discardBtn]}
          onPress={handleDiscardPress}
          accessibilityLabel="Descartar y enviar a papelera"
        >
          <Text style={styles.actionBtnText}>✕</Text>
          <Text style={styles.actionBtnLabel}>Descartar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.keepBtn]}
          onPress={handleKeepPress}
          accessibilityLabel="Conservar y asignar etiquetas"
        >
          <Text style={styles.actionBtnText}>♥</Text>
          <Text style={styles.actionBtnLabel}>Guardar</Text>
        </TouchableOpacity>
      </View>

      {/* Tagging Sheet Modal */}
      <TaggingModal
        visible={modalVisible}
        asset={activeAsset}
        metadata={metadata}
        aiSuggestion={{
          category: 'Paisaje',
          tags: ['Italia', 'Atardecer'],
          album: 'Viaje a Italia 2024',
        }}
        onSave={handleSaveClassification}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  counterText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  bold: {
    fontWeight: '700',
    color: theme.colors.primaryLight,
  },
  undoBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.full,
  },
  undoText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  card: {
    width: SCREEN_WIDTH - 32,
    height: '92%',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    flex: 1,
    backgroundColor: '#334155',
  },
  cardFooter: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  cardDate: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  cardHint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  actionBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  discardBtn: {
    backgroundColor: theme.colors.accentRed,
  },
  keepBtn: {
    backgroundColor: theme.colors.accentGreen,
  },
  actionBtnText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionBtnLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  summaryBox: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    gap: 8,
  },
  summaryText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
});
