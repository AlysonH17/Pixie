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
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../core/theme';
import { Asset, AssetMetadata, TriageMode } from '../../../core/database/types';
import { TaggingModal } from './TaggingModal';
import { parseMediaMetadata, formatCaptureDate } from '../../metadata/exifParser';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TriageScreenProps {
  initialAssets: Asset[];
  defaultMode?: TriageMode;
  onQuickKeep: (assetId: string) => void;
  onDetailedKeep: (assetId: string, tags: string[], albums: string[]) => void;
  onDiscard: (assetId: string) => void;
  onUndo?: () => void;
  onClose: () => void;
}

export const TriageScreen: React.FC<TriageScreenProps> = ({
  initialAssets,
  defaultMode = 'quick',
  onQuickKeep,
  onDetailedKeep,
  onDiscard,
  onUndo,
  onClose,
}) => {
  const [queue, setQueue] = useState<Asset[]>(initialAssets);
  const [mode, setMode] = useState<TriageMode>(defaultMode);
  const [activeAsset, setActiveAsset] = useState<Asset | null>(
    initialAssets.length > 0 ? initialAssets[0] : null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [metadata, setMetadata] = useState<AssetMetadata | null>(null);
  const [keptCount, setKeptCount] = useState(0);
  const [discardedCount, setDiscardedCount] = useState(0);

  // Sync active asset when queue updates
  React.useEffect(() => {
    if (queue.length > 0) {
      const current = queue[0];
      setActiveAsset(current);
      const parsed = parseMediaMetadata({
        id: current.id,
        uri: current.uri,
        creationTime: Date.now() - 1000 * 60 * 60 * 24 * 14,
        location: { latitude: 41.9028, longitude: 12.4964 },
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
    if (mode === 'quick') {
      // Fast mode: save immediately without opening modal
      onQuickKeep(activeAsset.id);
      setKeptCount((c) => c + 1);
      setQueue((prev) => prev.slice(1));
    } else {
      // Detailed mode: open tagging modal
      setModalVisible(true);
    }
  };

  const handleSaveDetailed = (tags: string[], albums: string[]) => {
    if (!activeAsset) return;
    onDetailedKeep(activeAsset.id, tags, albums);
    setKeptCount((c) => c + 1);
    setModalVisible(false);
    setQueue((prev) => prev.slice(1));
  };

  if (!activeAsset || queue.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBadge}>
            <Feather name="check" size={28} color={theme.colors.actionKeep} />
          </View>
          <Text style={styles.emptyTitle}>Revisión completada</Text>
          <Text style={styles.emptySubtitle}>
            No quedan elementos pendientes en esta sesión. Tus fotos seleccionadas
            fueron preservadas y las descartadas esperan en la papelera.
          </Text>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Conservadas</Text>
              <Text style={styles.summaryValue}>{keptCount}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>En papelera</Text>
              <Text style={styles.summaryValue}>{discardedCount}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.returnButton} onPress={onClose}>
            <Text style={styles.returnButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onClose}>
          <Feather name="arrow-left" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        {/* Mode Segmented Switch */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segment, mode === 'quick' && styles.segmentActive]}
            onPress={() => setMode('quick')}
          >
            <Feather
              name="zap"
              size={12}
              color={mode === 'quick' ? '#0B0C0E' : theme.colors.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.segmentText,
                mode === 'quick' && styles.segmentTextActive,
              ]}
            >
              Rápido
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segment, mode === 'detailed' && styles.segmentActive]}
            onPress={() => setMode('detailed')}
          >
            <Feather
              name="sliders"
              size={12}
              color={mode === 'detailed' ? '#0B0C0E' : theme.colors.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.segmentText,
                mode === 'detailed' && styles.segmentTextActive,
              ]}
            >
              Detallado
            </Text>
          </TouchableOpacity>
        </View>

        {onUndo ? (
          <TouchableOpacity style={styles.iconButton} onPress={onUndo}>
            <Feather name="rotate-ccw" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      {/* Queue Counter Header */}
      <View style={styles.queueInfoRow}>
        <Text style={styles.queueInfoText}>
          Pendientes: <Text style={styles.queueInfoStrong}>{queue.length}</Text>
        </Text>
        <Text style={styles.modeHintText}>
          {mode === 'quick'
            ? 'Deslizar derecha guarda directo sin preguntar'
            : 'Deslizar derecha despliega atributos'}
        </Text>
      </View>

      {/* Central Visual Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={{ uri: activeAsset.uri }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardMetaBar}>
            <View>
              <Text style={styles.cardDate}>
                {formatCaptureDate(metadata?.capturedAt)}
              </Text>
              {metadata?.locationCity && (
                <Text style={styles.cardLocation}>
                  {metadata.locationCity}, {metadata.locationCountry}
                </Text>
              )}
            </View>
            <View style={styles.mediaTypePill}>
              <Text style={styles.mediaTypeText}>
                {activeAsset.mediaType === 'video' ? 'VIDEO' : 'FOTO'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.discardBtn]}
          onPress={handleDiscardPress}
          accessibilityLabel="Descartar foto"
        >
          <Feather name="x" size={24} color={theme.colors.actionDiscard} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.keepBtn]}
          onPress={handleKeepPress}
          accessibilityLabel="Guardar foto"
        >
          <Feather name="check" size={24} color={theme.colors.actionKeep} />
        </TouchableOpacity>
      </View>

      {/* Tagging Modal for Detailed Mode */}
      <TaggingModal
        visible={modalVisible}
        asset={activeAsset}
        metadata={metadata}
        onSave={handleSaveDetailed}
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
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.full,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  segmentTextActive: {
    color: '#0B0C0E',
    fontWeight: '600',
  },
  queueInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xs,
  },
  queueInfoText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  queueInfoStrong: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  modeHintText: {
    fontSize: 11,
    color: theme.colors.textMuted,
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
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardImage: {
    width: '100%',
    flex: 1,
    backgroundColor: '#1A1C20',
  },
  cardMetaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  cardDate: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  cardLocation: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  mediaTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.xs,
    backgroundColor: theme.colors.surfaceElevated,
  },
  mediaTypeText: {
    ...theme.typography.labelSmall,
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
  },
  discardBtn: {
    borderColor: theme.colors.actionDiscard,
    backgroundColor: theme.colors.actionDiscardSubtle,
  },
  keepBtn: {
    borderColor: theme.colors.actionKeep,
    backgroundColor: theme.colors.actionKeepSubtle,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.actionKeepSubtle,
    borderWidth: 1,
    borderColor: theme.colors.actionKeep,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  summaryBox: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    width: '100%',
  },
  summaryRow: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  returnButton: {
    marginTop: theme.spacing.xl,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.sm,
  },
  returnButtonText: {
    color: '#0B0C0E',
    fontWeight: '600',
    fontSize: 14,
  },
});
