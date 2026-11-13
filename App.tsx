import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { theme } from './src/core/theme';
import { DashboardScreen } from './src/features/dashboard/components/DashboardScreen';
import { TriageScreen } from './src/features/triage/components/TriageScreen';
import { LibraryScreen } from './src/features/albums/components/LibraryScreen';
import { SearchScreen } from './src/features/ai-assistant/components/SearchScreen';
import { Asset, TriageMode } from './src/core/database/types';

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

type ActiveTab = 'dashboard' | 'triage' | 'library' | 'search' | 'trash';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [triageMode, setTriageMode] = useState<TriageMode>('quick');
  const [discardedCount, setDiscardedCount] = useState(0);
  const [unclassifiedCount, setUnclassifiedCount] = useState(2);
  const [totalSavedCount, setTotalSavedCount] = useState(48);

  const handleOpenTriage = (mode: TriageMode) => {
    setTriageMode(mode);
    setActiveTab('triage');
  };

  const handleQuickKeep = (assetId: string) => {
    setUnclassifiedCount((c) => c + 1);
    setTotalSavedCount((c) => c + 1);
  };

  const handleDetailedKeep = (assetId: string, tags: string[], albums: string[]) => {
    setTotalSavedCount((c) => c + 1);
  };

  const handleDiscard = (assetId: string) => {
    setDiscardedCount((c) => c + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Main View Shell */}
      <View style={styles.content}>
        {activeTab === 'dashboard' && (
          <DashboardScreen
            newPhotosCount={SAMPLE_DEVICE_ASSETS.length}
            unclassifiedCount={unclassifiedCount}
            totalSavedCount={totalSavedCount}
            onOpenTriage={handleOpenTriage}
            onOpenLibrary={() => setActiveTab('library')}
            onOpenSearch={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'triage' && (
          <TriageScreen
            initialAssets={SAMPLE_DEVICE_ASSETS}
            defaultMode={triageMode}
            onQuickKeep={handleQuickKeep}
            onDetailedKeep={handleDetailedKeep}
            onDiscard={handleDiscard}
            onClose={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'library' && <LibraryScreen />}
        {activeTab === 'search' && <SearchScreen />}

        {activeTab === 'trash' && (
          <View style={styles.trashContainer}>
            <View style={styles.trashIconBox}>
              <Feather name="trash-2" size={28} color={theme.colors.actionDiscard} />
            </View>
            <Text style={styles.trashTitle}>Papelera de Reciclaje</Text>
            <Text style={styles.trashSubtitle}>
              {discardedCount === 0
                ? 'No hay elementos en espera de eliminación.'
                : `Tienes ${discardedCount} elementos marcados para descarte permanente.`}
            </Text>

            {discardedCount > 0 && (
              <TouchableOpacity
                style={styles.emptyTrashBtn}
                onPress={() => setDiscardedCount(0)}
              >
                <Text style={styles.emptyTrashText}>Vaciar Papelera</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Minimalist Bottom Bar */}
      {activeTab !== 'triage' && (
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navItem, activeTab === 'dashboard' && styles.navItemActive]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Feather
              name="home"
              size={18}
              color={activeTab === 'dashboard' ? '#FFFFFF' : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'dashboard' && styles.navLabelActive,
              ]}
            >
              Inicio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'library' && styles.navItemActive]}
            onPress={() => setActiveTab('library')}
          >
            <Feather
              name="folder"
              size={18}
              color={activeTab === 'library' ? '#FFFFFF' : theme.colors.textMuted}
            />
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
            <Feather
              name="search"
              size={18}
              color={activeTab === 'search' ? '#FFFFFF' : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'search' && styles.navLabelActive,
              ]}
            >
              Buscar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'trash' && styles.navItemActive]}
            onPress={() => setActiveTab('trash')}
          >
            <Feather
              name="trash-2"
              size={18}
              color={activeTab === 'trash' ? '#FFFFFF' : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'trash' && styles.navLabelActive,
              ]}
            >
              Papelera
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  navItemActive: {
    backgroundColor: theme.colors.surfaceElevated,
  },
  navLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  trashIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.actionDiscardSubtle,
    borderWidth: 1,
    borderColor: theme.colors.actionDiscard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  trashTitle: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
  },
  trashSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 280,
  },
  emptyTrashBtn: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.actionDiscard,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.sm,
  },
  emptyTrashText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
