import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../core/theme';

interface DashboardScreenProps {
  newPhotosCount: number;
  unclassifiedCount: number;
  totalSavedCount: number;
  onOpenTriage: (mode: 'quick' | 'detailed') => void;
  onOpenLibrary: () => void;
  onOpenSearch: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  newPhotosCount,
  unclassifiedCount,
  totalSavedCount,
  onOpenTriage,
  onOpenLibrary,
  onOpenSearch,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Minimalist Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>Pixie</Text>
          <View style={styles.libraryStatusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{totalSavedCount} fotos indexadas</Text>
          </View>
        </View>

        {/* Non-Invasive Alert Banner: New Unreviewed Photos */}
        {newPhotosCount > 0 ? (
          <View style={styles.alertCard}>
            <View style={styles.alertHeaderRow}>
              <View style={styles.badgeNew}>
                <Feather name="bell" size={13} color="#FFFFFF" />
                <Text style={styles.badgeNewText}>Nuevas en el carrete</Text>
              </View>
              <Text style={styles.counterHighlight}>{newPhotosCount} fotos</Text>
            </View>

            <Text style={styles.alertTitle}>Limpieza y revisión pendiente</Text>
            <Text style={styles.alertDescription}>
              Revisa tus fotos recientes en modo rápido o clasifícalas en detalle cuando tengas tiempo.
            </Text>

            <View style={styles.alertActionsRow}>
              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={() => onOpenTriage('quick')}
                accessibilityLabel="Iniciar limpieza rápida"
              >
                <Feather name="zap" size={14} color="#0B0C0E" style={{ marginRight: 6 }} />
                <Text style={styles.primaryActionText}>Limpieza rápida</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={() => onOpenTriage('detailed')}
                accessibilityLabel="Clasificar en detalle"
              >
                <Text style={styles.secondaryActionText}>Clasificar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.allCaughtUpCard}>
            <Feather name="check-circle" size={16} color={theme.colors.actionKeep} />
            <Text style={styles.allCaughtUpText}>
              Biblioteca al día. No hay fotos nuevas pendientes por revisar.
            </Text>
          </View>
        )}

        {/* Deferred Tagging Banner */}
        {unclassifiedCount > 0 && (
          <TouchableOpacity
            style={styles.unclassifiedBanner}
            onPress={() => onOpenTriage('detailed')}
            activeOpacity={0.8}
          >
            <View style={styles.unclassifiedIconWrapper}>
              <Feather name="tag" size={16} color={theme.colors.textPrimary} />
            </View>
            <View style={styles.unclassifiedTextContainer}>
              <Text style={styles.unclassifiedTitle}>
                {unclassifiedCount} fotos por etiquetar
              </Text>
              <Text style={styles.unclassifiedSubtitle}>
                Guardadas en modo rápido. Asigna personas o eventos ahora.
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Quick Access Navigation Modules */}
        <Text style={styles.sectionHeader}>Colecciones y Búsqueda</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.moduleCard}
            onPress={onOpenLibrary}
            activeOpacity={0.7}
          >
            <Feather name="folder" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.moduleTitle}>Rutas Virtuales</Text>
            <Text style={styles.moduleSubtitle}>
              Álbumes y personas sin duplicación física
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moduleCard}
            onPress={onOpenSearch}
            activeOpacity={0.7}
          >
            <Feather name="search" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.moduleTitle}>Búsqueda Asistida</Text>
            <Text style={styles.moduleSubtitle}>
              Consulta en lenguaje natural por escena
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  brandTitle: {
    ...theme.typography.headline,
    color: theme.colors.textPrimary,
  },
  libraryStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.actionKeep,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  alertCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  badgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeNewText: {
    ...theme.typography.labelSmall,
    color: theme.colors.textSecondary,
  },
  counterHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
  },
  alertTitle: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  alertDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  alertActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 11,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  secondaryActionButton: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  allCaughtUpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    gap: 10,
    marginBottom: theme.spacing.md,
  },
  allCaughtUpText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  unclassifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  unclassifiedIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unclassifiedTextContainer: {
    flex: 1,
  },
  unclassifiedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  unclassifiedSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    ...theme.typography.labelSmall,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  grid: {
    gap: 12,
  },
  moduleCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 10,
    marginBottom: 2,
  },
  moduleSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
