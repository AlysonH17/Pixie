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
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../core/theme';

interface VirtualRouteItem {
  id: string;
  title: string;
  type: 'album' | 'person' | 'category';
  count: number;
  iconName: keyof typeof Feather.glyphMap;
}

export const LibraryScreen: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  const routes: VirtualRouteItem[] = [
    { id: 'alb-italia', title: 'Viaje a Italia 2024', type: 'album', count: 42, iconName: 'folder' },
    { id: 'tag-mama', title: 'Fotos con Mamá', type: 'person', count: 18, iconName: 'user' },
    { id: 'tag-comida', title: 'Gastronomía', type: 'category', count: 25, iconName: 'compass' },
    { id: 'tag-atardecer', title: 'Atardeceres', type: 'category', count: 14, iconName: 'sun' },
  ];

  const mockCrossReferencedPhotos = [
    {
      id: 'photo-1',
      uri: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500',
      caption: 'Terraza en Roma',
      routes: ['Viaje a Italia 2024', 'Fotos con Mamá', 'Gastronomía'],
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
        <Text style={styles.title}>Rutas Virtuales</Text>
        <Text style={styles.subtitle}>
          Colecciones multidimensionales sin duplicación de archivos físicos
        </Text>
      </View>

      {/* Routes Horizontal Filter */}
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
                <Feather
                  name={item.iconName}
                  size={16}
                  color={isSelected ? '#0B0C0E' : theme.colors.textSecondary}
                  style={styles.routeIcon}
                />
                <Text style={[styles.routeTitle, isSelected && styles.routeTitleSelected]}>
                  {item.title}
                </Text>
                <Text style={[styles.routeCount, isSelected && styles.routeCountSelected]}>
                  {item.count} fotos
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Cross-referenced Gallery */}
      <View style={styles.gallerySection}>
        <Text style={styles.sectionHeading}>Fotos Indexadas</Text>
        <FlatList
          data={mockCrossReferencedPhotos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.galleryContent}
          renderItem={({ item }) => (
            <View style={styles.photoItem}>
              <Image source={{ uri: item.uri }} style={styles.photoThumb} />
              <View style={styles.photoMeta}>
                <Text style={styles.photoCaption}>{item.caption}</Text>
                <Text style={styles.routesLabel}>Rutas asociadas:</Text>
                <View style={styles.tagsContainer}>
                  {item.routes.map((r) => (
                    <View key={r} style={styles.routeBadge}>
                      <Text style={styles.routeBadgeText}>{r}</Text>
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
    ...theme.typography.headline,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  filtersWrapper: {
    marginTop: theme.spacing.sm,
  },
  routesList: {
    paddingHorizontal: theme.spacing.lg,
    gap: 10,
  },
  routeCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    minWidth: 130,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  routeCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  routeIcon: {
    marginBottom: 8,
  },
  routeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  routeTitleSelected: {
    color: '#0B0C0E',
  },
  routeCount: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  routeCountSelected: {
    color: '#686B74',
  },
  gallerySection: {
    flex: 1,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeading: {
    ...theme.typography.labelSmall,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  galleryContent: {
    gap: 12,
    paddingBottom: theme.spacing.xl,
  },
  photoItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.xs,
    backgroundColor: '#1E2024',
  },
  photoMeta: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },
  photoCaption: {
    fontSize: 14,
    fontWeight: '600',
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
    borderRadius: theme.borderRadius.xs,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  routeBadgeText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
