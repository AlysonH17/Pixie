import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { theme } from '../../../core/theme';

interface VirtualRouteItem {
  id: string;
  title: string;
  type: 'album' | 'person' | 'category';
  count: number;
  icon: string;
}

export const LibraryScreen: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  const routes: VirtualRouteItem[] = [
    { id: 'alb-italia', title: 'Viaje a Italia 2024', type: 'album', count: 42, icon: '✈️' },
    { id: 'tag-mama', title: 'Fotos con Mamá', type: 'person', count: 18, icon: '👩‍👧' },
    { id: 'tag-comida', title: 'Comida & Restaurantes', type: 'category', count: 25, icon: '🍕' },
    { id: 'tag-atardecer', title: 'Atardeceres', type: 'category', count: 14, icon: '🌅' },
  ];

  // Mock cross-referenced photos
  const mockCrossReferencedPhotos = [
    {
      id: 'photo-1',
      uri: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500',
      caption: 'Cena con Mamá en Roma',
      routes: ['Viaje a Italia 2024', 'Fotos con Mamá', 'Comida & Restaurantes'],
    },
    {
      id: 'photo-2',
      uri: 'https://images.unsplash.com/photo-1523906834658-6e2522d4282d?w=500',
      caption: 'Canales de Venecia',
      routes: ['Viaje a Italia 2024', 'Atardeceres'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rutas y Álbumes Virtuales</Text>
        <Text style={styles.subtitle}>
          Misma foto en diferentes colecciones con cero duplicación de almacenamiento
        </Text>
      </View>

      {/* Virtual Route Filters */}
      <View style={styles.filtersWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={routes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.routesList}
          renderItem={({ item }) => {
            const isSelected = selectedRoute === item.id;
            return (
              <TouchableOpacity
                style={[styles.routeCard, isSelected && styles.routeCardSelected]}
                onPress={() => setSelectedRoute(item.id)}
              >
                <Text style={styles.routeIcon}>{item.icon}</Text>
                <Text style={styles.routeTitle}>{item.title}</Text>
                <Text style={styles.routeCount}>{item.count} fotos</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Cross-referenced Gallery List */}
      <View style={styles.gallerySection}>
        <Text style={styles.sectionHeading}>Fotos Indexadas:</Text>
        <FlatList
          data={mockCrossReferencedPhotos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.galleryContent}
          renderItem={({ item }) => (
            <View style={styles.photoItem}>
              <Image source={{ uri: item.uri }} style={styles.photoThumb} />
              <View style={styles.photoMeta}>
                <Text style={styles.photoCaption}>{item.caption}</Text>
                <Text style={styles.routesLabel}>Aparece en estas rutas:</Text>
                <View style={styles.tagsContainer}>
                  {item.routes.map((r) => (
                    <View key={r} style={styles.routeBadge}>
                      <Text style={styles.routeBadgeText}>📁 {r}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  filtersWrapper: {
    marginTop: theme.spacing.sm,
  },
  routesList: {
    paddingHorizontal: theme.spacing.lg,
    gap: 12,
  },
  routeCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 140,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  routeCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  routeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  routeCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  gallerySection: {
    flex: 1,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  galleryContent: {
    gap: 16,
    paddingBottom: theme.spacing.xl,
  },
  photoItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  photoThumb: {
    width: 90,
    height: 90,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#334155',
  },
  photoMeta: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },
  photoCaption: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  routesLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  routeBadge: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
  },
  routeBadgeText: {
    fontSize: 11,
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
});
