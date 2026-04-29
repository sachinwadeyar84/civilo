/**
 * ReviewScreen — submit star rating + optional comment.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { colors, spacing, radius, font } from '../styles/theme';
import { reviews as reviewsApi } from '../services/api';

export default function ReviewScreen({ route, navigation }) {
  const { bookingId, vendorName } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (rating === 0) return Alert.alert('Pick a rating');
    setSubmitting(true);
    try {
      await reviewsApi.create({ bookingId, rating, comment });
      Alert.alert('Thanks!', 'Your review has been submitted.', [
        { text: 'OK', onPress: () => navigation.navigate('Main') }
      ]);
    } catch (e) {
      Alert.alert('Could not submit', e.response?.data?.error || 'Try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ padding: spacing.lg }}>
        <Text style={font.h2}>How was the work by {vendorName}?</Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} onPress={() => setRating(n)} style={{ padding: 6 }}>
              <Text style={{ fontSize: 44 }}>{n <= rating ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.helper}>{rating === 0 ? 'Tap a star' : `${rating} / 5`}</Text>

        <TextInput
          style={styles.input}
          placeholder="Tell others about your experience (optional)"
          value={comment}
          onChangeText={setComment}
          multiline
        />

        <TouchableOpacity
          style={[styles.btn, submitting && { opacity: 0.6 }]}
          onPress={submit}
          disabled={submitting}
        >
          <Text style={styles.btnText}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  starsRow: {
    flexDirection: 'row', justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  helper: { textAlign: 'center', color: colors.textMuted, marginBottom: spacing.lg },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    padding: spacing.md, minHeight: 100, ...font.body,
  },
  btn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center', marginTop: spacing.lg,
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
