/**
 * ServiceListScreen — list of vendors in chosen category.
 * Card style: photo + name + rating + tagline + price + distance.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing, radius, font } from '../styles/theme';
import { vendors as vendorsApi } from '../services/api';

export default function ServiceListScreen({ route, navigation }) {
  const { category, label } = route.params;
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: `${label}s near you` });
    vendorsApi.list({ category, lat: 12.93, lng: 77.62, radius: 10 })
      .then(setVendors)
      .catch(() => setVendors([])) // graceful degradation
      .finally(() => setLoading(false));
  }, [category]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VendorProfile', { id: item.id })}
    >
      <View style={styles.cardImg} />
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <Text style={font.h3} numberOfLines={1}>{item.business_name}</Text>
          <Text style={styles.rating}>⭐ {item.rating_avg ?? '—'}</Text>
        </View>
        <Text style={{ color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
          {item.experience_years} yrs exp
        </Text>
        <View style={[styles.row, { marginTop: 6 }]}>
          <Text style={font.body}>
            ₹{item.min_price ?? '—'}{item.min_price ? '/sqft onwards' : ''}
          </Text>
          {item.distance_km != null && (
            <Text style={{ color: colors.textMuted }}>
              {item.distance_km.toFixed(1)} km
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {vendors.length === 0 ? (
        <Text style={styles.empty}>No vendors yet in your area. We're onboarding more soon.</Text>
      ) : (
        <FlatList
          data={vendors}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  card: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  cardImg: {
    width: '100%', height: 160,
    backgroundColor: '#E5E5E5',
  },
  cardBody: { padding: spacing.md },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  rating: { ...font.h3, color: colors.success },
  empty: { ...font.body, color: colors.textMuted, textAlign: 'center', marginTop: 80, paddingHorizontal: spacing.lg },
});
