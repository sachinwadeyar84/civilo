/**
 * OrderTrackingScreen — visual progress through booking lifecycle.
 * Polls every 10s for status updates (real version uses push + sockets).
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, radius, font } from '../styles/theme';
import { bookings as bookingsApi } from '../services/api';

const STAGES = [
  { key: 'requested',   label: 'Requested' },
  { key: 'accepted',    label: 'Accepted' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed',   label: 'Completed' },
];

export default function OrderTrackingScreen({ route, navigation }) {
  const { id } = route.params;
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const b = await bookingsApi.detail(id);
        if (active) setBooking(b);
      } catch (_e) {}
    }
    load();
    const t = setInterval(load, 10000);
    return () => { active = false; clearInterval(t); };
  }, [id]);

  if (!booking) {
    return <SafeAreaView style={styles.safe}><ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /></SafeAreaView>;
  }

  const currentIdx = STAGES.findIndex(s => s.key === booking.status);
  const isCompleted = booking.status === 'completed';

  async function cancel() {
    Alert.alert('Cancel booking?', 'You can re-book anytime.', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, cancel', style: 'destructive', onPress: async () => {
        try {
          const b = await bookingsApi.updateStatus(id, 'cancelled');
          setBooking({ ...booking, ...b });
        } catch (e) { Alert.alert('Could not cancel', e.response?.data?.error || ''); }
      }},
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>

        <Text style={font.h3}>Booking #{booking.id.slice(0, 8).toUpperCase()}</Text>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          {STAGES.map((s, i) => (
            <React.Fragment key={s.key}>
              <View style={[styles.dot, i <= currentIdx && styles.dotActive]} />
              {i < STAGES.length - 1 && (
                <View style={[styles.line, i < currentIdx && styles.lineActive]} />
              )}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.stageLabels}>
          {STAGES.map(s => (
            <Text key={s.key} style={[styles.stageText, s.key === booking.status && styles.stageActive]}>
              {s.label}
            </Text>
          ))}
        </View>

        {/* Vendor card */}
        <View style={styles.vendorCard}>
          <View style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={font.h3}>{booking.vendor_name}</Text>
            <Text style={{ color: colors.textMuted, marginTop: 2 }}>{booking.service_title}</Text>
          </View>
        </View>

        {/* Job details */}
        <View style={styles.detailsBox}>
          <Detail label="Date" value={`${booking.scheduled_date} • ${booking.time_slot}`} />
          <Detail label="Address" value={booking.address} />
          <Detail label="Scope" value={booking.scope_text} />
          <Detail
            label="Estimate"
            value={`₹${booking.price_estimate_min} – ₹${booking.price_estimate_max}`}
          />
          {booking.final_price && (
            <Detail label="Final price" value={`₹${booking.final_price}`} />
          )}
        </View>

        {/* Actions */}
        {isCompleted && (
          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() => navigation.navigate('Review', { bookingId: booking.id, vendorName: booking.vendor_name })}
          >
            <Text style={{ color: '#FFF', fontWeight: '700' }}>Rate this service</Text>
          </TouchableOpacity>
        )}
        {!isCompleted && booking.status !== 'cancelled' && (
          <TouchableOpacity onPress={cancel} style={{ marginTop: spacing.lg, alignItems: 'center' }}>
            <Text style={{ color: colors.textMuted }}>Cancel booking</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Detail({ label, value }) {
  return (
    <View style={{ marginBottom: spacing.sm }}>
      <Text style={{ color: colors.textMuted, fontSize: 12 }}>{label}</Text>
      <Text style={font.body}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  progressRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: spacing.lg, marginBottom: spacing.sm,
  },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary },
  line: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: 4 },
  lineActive: { backgroundColor: colors.primary },
  stageLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  stageText: { ...font.caption, color: colors.textMuted, flex: 1, textAlign: 'center' },
  stageActive: { color: colors.primary, fontWeight: '700' },
  vendorCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgMuted, padding: spacing.md,
    borderRadius: radius.md, marginTop: spacing.lg,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#CCC' },
  detailsBox: {
    backgroundColor: colors.bgMuted,
    borderRadius: radius.md, padding: spacing.md,
    marginTop: spacing.md,
  },
  reviewBtn: {
    backgroundColor: colors.primary, padding: spacing.md,
    borderRadius: radius.md, alignItems: 'center', marginTop: spacing.lg,
  },
});
