/**
 * VendorProfileScreen — full vendor detail.
 * Sections: hero, header (name+rating+CTAs), about, services, portfolio, reviews.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, spacing, radius, font } from '../styles/theme';
import { vendors as vendorsApi } from '../services/api';

export default function VendorProfileScreen({ route, navigation }) {
  const { id } = route.params;
  const [data, setData] = useState(null);

  useEffect(() => {
    vendorsApi.detail(id).then(setData).catch(() => {});
  }, [id]);

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  const { vendor, services: vSvcs, reviews } = data;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <View style={styles.hero} />

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={font.h1}>{vendor.business_name}</Text>
            <Text style={{ color: colors.textMuted, marginTop: 4 }}>
              {vendor.experience_years} yrs experience
            </Text>
          </View>
          <Text style={styles.rating}>⭐ {vendor.rating_avg ?? '—'}  ({vendor.rating_count})</Text>
        </View>

        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={[styles.cta, styles.ctaPrimary]}
            onPress={() => navigation.navigate('Booking', { vendor, services: vSvcs })}
          >
            <Text style={styles.ctaPrimaryText}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cta, styles.ctaSecondary]}>
            <Text>Call</Text>
          </TouchableOpacity>
        </View>

        <Section title="About">
          <Text style={font.body}>{vendor.bio || 'No bio yet.'}</Text>
        </Section>

        <Section title="Services & Pricing">
          {vSvcs.map(s => (
            <View key={s.id} style={styles.serviceRow}>
              <Text style={font.body}>{s.title}</Text>
              <Text style={font.h3}>₹{s.price_per_unit}/{s.unit}</Text>
            </View>
          ))}
        </Section>

        <Section title={`Reviews (${vendor.rating_count})`}>
          {reviews.length === 0
            ? <Text style={{ color: colors.textMuted }}>No reviews yet.</Text>
            : reviews.slice(0, 5).map(r => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.row}>
                    <Text style={font.h3}>{r.customer_name}</Text>
                    <Text>{'⭐'.repeat(r.rating)}</Text>
                  </View>
                  {r.comment ? <Text style={{ marginTop: 4 }}>{r.comment}</Text> : null}
                </View>
              ))
          }
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={[font.h2, { marginBottom: spacing.sm }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: { width: '100%', height: 200, backgroundColor: '#DDD' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingTop: spacing.md,
  },
  rating: { ...font.h3, color: colors.success },
  ctaRow: {
    flexDirection: 'row', paddingHorizontal: spacing.md, marginTop: spacing.md,
  },
  cta: {
    flex: 1, padding: spacing.md, borderRadius: radius.md,
    alignItems: 'center', marginHorizontal: spacing.xs,
  },
  ctaPrimary: { backgroundColor: colors.primary },
  ctaPrimaryText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  ctaSecondary: { backgroundColor: colors.bgMuted },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  serviceRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  reviewCard: {
    backgroundColor: colors.bgMuted, padding: spacing.md,
    borderRadius: radius.sm, marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});
