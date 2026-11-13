import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import { theme } from '../../../core/theme';
import { GeminiVisionClient } from '../geminiClient';

interface SearchResultItem {
  id: string;
  uri: string;
  caption: string;
  description: string;
}

export const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const mockIndexedPhotos: SearchResultItem[] = [
    {
      id: 'photo-1',
      uri: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500',
      caption: 'Viaje a Roma',
      description: 'Cena con mamá comiendo pizza en una terraza en Italia',
    },
    {
      id: 'photo-2',
      uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
      caption: 'Playa Tropical',
      description: 'Atardecer soleado en la playa con arena blanca y palmeras',
    },
    {
      id: 'photo-3',
      uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
      caption: 'Montañas y Lago',
      description: 'Paisaje de montaña con cielo despejado y agua cristalina',
    },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setHasSearched(true);
    const client = new GeminiVisionClient('');
    const matchedIds = await client.searchByDescription(
      query,
      mockIndexedPhotos.map((p) => ({ id: p.id, desc: `${p.caption} ${p.description}` }))
    );
    const filtered = mockIndexedPhotos.filter((p) => matchedIds.includes(p.id));
    setResults(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Búsqueda Inteligente con IA</Text>
        <Text style={styles.subtitle}>
          Encuentra fotos por descripciones naturales cuando no recuerdes el álbum
        </Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Ej: 'pizza con mamá' o 'playa al atardecer'..."
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsArea}>
        {hasSearched && results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No se encontraron fotos para "{query}"</Text>
          </View>
        ) : (
          <FlatList
            data={hasSearched ? results : mockIndexedPhotos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.resultCard}>
                <Image source={{ uri: item.uri }} style={styles.resultThumb} />
                <View style={styles.resultMeta}>
                  <Text style={styles.resultCaption}>{item.caption}</Text>
                  <Text style={styles.resultDesc}>✨ {item.description}</Text>
                </View>
              </View>
            )}
          />
        )}
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
  searchBar: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    color: theme.colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  resultsArea: {
    flex: 1,
    marginTop: theme.spacing.lg,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: 14,
    paddingBottom: theme.spacing.xl,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultThumb: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#334155',
  },
  resultMeta: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },
  resultCaption: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  resultDesc: {
    fontSize: 12,
    color: theme.colors.primaryLight,
    marginTop: 4,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
});
