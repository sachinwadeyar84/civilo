/**
 * HomeScreen — landing screen.
 * Layout: location header → search bar → greeting → 6 category cards (2-col grid)
 *         → "Top rated near you" horizontal scroll.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, radius, font } from '../styles/theme';
import { services } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [location] = useState('Koramangala, Bengaluru'); // TODO: real geolocation

  useEffect(() => {
    services.categories().then(setCategories).catch(() => {
      // Fallback to local list if API not reachable yet
      setCategories([
        { key: 'interior_designer', label: 'Interior Designer', icon: '🎨' },
        { key: 'civil_engineer',    label: 'Civil Engineer',    icon: '🏗️' },
        { key: 'contractor',        label: 'Contractor',        icon: '🔨' },
        { key: 'painter',           label: 'Painter',           icon: '🖌️' },
        { key: 'plumber',           label: 'Plumber',           icon: '🔧' },
        { key: 'electrician',       label: 'Electrician',       icon: '⚡' },
      ]);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Location bar */}
        <View style={styles.locationRow}>
          <Text style={styles.locationLabel}>📍 {location}  ▼</Text>
          <Text style={styles.bell}>🔔</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <TextInput
            placeholder='Search "painter", "plumber"...'
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Hi 👋</Text>
        <Text style={styles.subGreeting}>What do you need today?</Text>

        {/* Category grid */}
        <View style={styles.grid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('ServiceList', { category: cat.key, label: cat.label })}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top rated section (placeholder) */}
        <Text style={styles.sectionTitle}>⭐ Top Rated Near You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md }}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.featuredCard}>
              <View style={styles.featuredImg} />
              <Text style={font.h3}>Vendor {i}</Text>
              <Text style={{ color: colors.textMuted }}>⭐ 4.7 • 2.3 km</Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  locationRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  locationLabel: { ...font.h3, color: colors.text },
  bell: { fontSize: 20 },
  searchWrap: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  searchInput: {
    backgroundColor: colors.bgMuted,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md, paddingVertical: 12,
    ...font.body,
  },
  greeting: { ...font.h1, paddingHorizontal: spacing.md, marginTop: spacing.md },
  subGreeting: { ...font.body, color: colors.textMuted, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.md - spacing.xs / 2,
  },
  categoryCard: {
    width: '47%', margin: '1.5%',
    backgroundColor: colors.bgMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 110, justifyContent: 'center',
  },
  categoryIcon: { fontSize: 32, marginBottom: spacing.sm },
  categoryLabel: { ...font.h3 },
  sectionTitle: { ...font.h2, paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  featuredCard: {
    width: 180, marginRight: spacing.md,
    backgroundColor: colors.bgMuted, borderRadius: radius.md, padding: spacing.sm,
  },
  featuredImg: {
    width: '100%', height: 100, borderRadius: radius.sm,
    backgroundColor: '#DDD', marginBottom: spacing.sm,
  },
});
