/**
 * BookingScreen — date, time slot, address, scope, photos.
 * Sticky bottom CTA "Confirm Booking".
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { colors, spacing, radius, font } from '../styles/theme';
import { bookings as bookingsApi } from '../services/api';

const TIME_SLOTS = ['9-12', '12-3', '3-6', '6-9'];

function dateLabel(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';
  return d.toDateString().slice(0, 10);
}

export default function BookingScreen({ route, navigation }) {
  const { vendor, services } = route.params;
  const [dayOffset, setDayOffset] = useState(0);
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [address, setAddress] = useState('');
  const [scope, setScope] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id);
  const [submitting, setSubmitting] = useState(false);

  const selectedService = services.find(s => s.id === serviceId);
  const estimate = selectedService
    ? {
        min: Math.round(Number(selectedService.price_per_unit) * 100 * 0.75),
        max: Math.round(Number(selectedService.price_per_unit) * 100 * 1.25),
      }
    : null;

  async function confirm() {
    if (!address.trim() || !scope.trim()) {
      Alert.alert('Missing info', 'Please fill address and scope of work.');
      return;
    }
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + dayOffset);

    setSubmitting(true);
    try {
      const booking = await bookingsApi.create({
        vendorId: vendor.id,
        serviceId,
        scheduledDate: scheduledDate.toISOString().slice(0, 10),
        timeSlot: slot,
        address,
        lat: 12.93, lng: 77.62, // TODO: geocode
        scopeText: scope,
        scopePhotos: [],
      });
      navigation.replace('OrderTracking', { id: booking.id });
    } catch (err) {
      Alert.alert('Booking failed', err.response?.data?.error || 'Try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>

        {/* Step 1: When */}
        <Text style={styles.stepLabel}>1. When do you need it?</Text>
        <View style={styles.chipRow}>
          {[0, 1, 2, 3].map(off => (
            <Chip key={off} active={dayOffset === off} label={dateLabel(off)} onPress={() => setDayOffset(off)} />
          ))}
        </View>
        <Text style={[styles.stepLabel, { marginTop: spacing.md }]}>Time slot</Text>
        <View style={styles.chipRow}>
          {TIME_SLOTS.map(t => (
            <Chip key={t} active={slot === t} label={`${t}`} onPress={() => setSlot(t)} />
          ))}
        </View>

        {/* Step 2: Where */}
        <Text style={[styles.stepLabel, { marginTop: spacing.lg }]}>2. Where?</Text>
        <TextInput
          style={styles.input}
          placeholder="Full address"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        {/* Step 3: Service + scope */}
        <Text style={[styles.stepLabel, { marginTop: spacing.lg }]}>3. What needs to be done?</Text>
        <View style={styles.serviceRow}>
          {services.map(s => (
            <Chip
              key={s.id}
              active={serviceId === s.id}
              label={s.title}
              onPress={() => setServiceId(s.id)}
            />
          ))}
        </View>
        <TextInput
          style={[styles.input, { minHeight: 100 }]}
          placeholder="e.g., 2 BHK interior, 800 sqft"
          value={scope}
          onChangeText={setScope}
          multiline
        />

        {/* Estimate */}
        {estimate && (
          <View style={styles.estimateBox}>
            <Text style={font.h3}>Estimate: ₹{estimate.min} – ₹{estimate.max}</Text>
            <Text style={{ color: colors.textMuted, marginTop: 4 }}>
              Final price after on-site visit
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmBtn, submitting && { opacity: 0.6 }]}
          disabled={submitting}
          onPress={confirm}
        >
          <Text style={styles.confirmText}>
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={active ? { color: '#FFF', fontWeight: '600' } : { color: colors.text }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  stepLabel: { ...font.h3, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  serviceRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: 8,
    borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border,
    marginRight: spacing.sm, marginBottom: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  input: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    ...font.body,
  },
  estimateBox: {
    backgroundColor: colors.bgMuted,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.md, backgroundColor: colors.bg,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
