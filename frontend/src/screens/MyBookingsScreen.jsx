/**
 * MyBookingsScreen — list of customer's bookings.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, radius, font } from '../styles/theme';
import { bookings as bookingsApi } from '../services/api';

const STATUS_COLOR = {
  requested: colors.warn,
  accepted: colors.primary,
  in_progress: colors.primary,
  completed: colors.success,
  cancelled: colors.textMuted,
  rejected: colors.textMuted,
};

export default function MyBookingsScreen({ navigation }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      bookingsApi.mine().then(setItems).catch(() => setItems([]));
    });
    return unsub;
  }, [navigation]);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.empty}>No bookings yet.{'\n'}Tap "Home" to find a service.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrderTracking', { id: item.id })}
          >
            <View style={styles.row}>
              <Text style={font.h3}>{item.vendor_name}</Text>
              <Text style={[styles.status, { color: STATUS_COLOR[item.status] || colors.text }]}>
                {item.status}
              </Text>
            </View>
            <Text style={{ color: colors.textMuted, marginTop: 4 }}>{item.service_title}</Text>
            <Text style={{ color: colors.textMuted, marginTop: 4 }}>
              {item.scheduled_date} • {item.time_slot}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: spacing.md }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  title: { ...font.h1, padding: spacing.md },
  card: {
    backgroundColor: colors.bg,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  status: { fontWeight: '700', textTransform: 'uppercase', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 100, color: colors.textMuted, lineHeight: 22 },
});
