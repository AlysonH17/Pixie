import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/core/theme';
import { TriageScreen } from './src/features/triage/components/TriageScreen';
import { LibraryScreen } from './src/features/albums/components/LibraryScreen';
import { SearchScreen } from './src/features/ai-assistant/components/SearchScreen';
import { Asset } from './src/core/database/types';

// Sample batch for testing and demonstration
const SAMPLE_DEVICE_ASSETS: Asset[] = [
  {
    id: 'asset-1',
    uri: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800',
    mediaType: 'image',
    fileSizeBytes: 3_500_000,
    triageStatus: 'pending',
    createdAt: '2026-05-12T14:20:00Z',
  },
  {
    id: 'asset-2',
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    mediaType: 'image',
    fileSizeBytes: 4_200_000,
    triageStatus: 'pending',
    createdAt: '2026-06-20T18:45:00Z',
  },
  {
    id: 'asset-3',
    uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    mediaType: 'image',
    fileSizeBytes: 2_800_000,
    triageStatus: 'pending',
    createdAt: '2026-07-04T09:15:00Z',
  },
];

type ActiveTab = 'triage' | 'library' | 'search' | 'trash';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('triage');
  const [discardedCount, setDiscardedCount] = useState(0);

  const handleKeep = (assetId: string, tags: string[], albums: string[]) => {
    console.log(`[Pixie] Foto guardada: ${assetId} con tags:`, tags, 'en álbumes:', albums);
  };

  const handleDiscard = (assetId: string) => {
    console.log(`[Pixie] Foto descartada: ${assetId}`);
    setDiscardedCount((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Main Screen Content */}
      <View style={styles.content}>
        {activeTab === 'triage' && (
          <TriageScreen
            initialAssets={SAMPLE_DEVICE_ASSETS}
            onKeep={handleKeep}
            onDiscard={handleDiscard}
          />
        )}
        {activeTab === 'library' && <LibraryScreen />}
        {activeTab === 'search' && <SearchScreen />}
        {activeTab === 'trash' && (
          <View style={styles.trashView}>
            <Text style={styles.trashEmoji}>🗑️</Text>
            <Text style={styles.trashTitle}>Papelera de Reciclaje</Text>
            <Text style={styles.trashSubtitle}>
              {discardedCount === 0
                ? 'No tienes fotos marcadas para eliminar.'
                : `Tienes ${discardedCount} fotos listas para ser liberadas permanentemente de tu memoria.`}
            </Text>
            {discardedCount > 0 && (
              <TouchableOpacity
                style={styles.deletePermanentBtn}
                onPress={() => setDiscardedCount(0)}
              >
                <Text style={styles.deletePermanentText}>
                  Liberar Espacio Permanentemente
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Bottom Accessible Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'triage' && styles.navItemActive]}
          onPress={() => setActiveTab('triage')}
        >
          <Text style={styles.navIcon}>⚡</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'triage' && styles.navLabelActive,
            ]}
          >
            Triage
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'library' && styles.navItemActive]}
          onPress={() => setActiveTab('library')}
        >
          <Text style={styles.navIcon}>📁</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'library' && styles.navLabelActive,
            ]}
          >
            Rutas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'search' && styles.navItemActive]}
          onPress={() => setActiveTab('search')}
        >
          <Text style={styles.navIcon}>🔍</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'search' && styles.navLabelActive,
            ]}
          >
            Buscar IA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'trash' && styles.navItemActive]}
          onPress={() => setActiveTab('trash')}
        >
          <Text style={styles.navIcon}>🗑️</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'trash' && styles.navLabelActive,
            ]}
          >
            Papelera ({discardedCount})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  navItemActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  navLabelActive: {
    color: theme.colors.primaryLight,
  },
  trashView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  trashEmoji: {
    fontSize: 56,
    marginBottom: theme.spacing.md,
  },
  trashTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  trashSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  deletePermanentBtn: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.accentRed,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.md,
  },
  deletePermanentText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
