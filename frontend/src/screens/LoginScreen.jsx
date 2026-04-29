/**
 * LoginScreen — phone + password.
 * MVP-simple. Real version uses OTP via SMS provider (MSG91 / Twilio).
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, font } from '../styles/theme';
import { auth } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function login() {
    setSubmitting(true);
    try {
      const { user, accessToken, refreshToken } = await auth.login(phone, password);
      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
        ['user', JSON.stringify(user)],
      ]);
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Login failed', e.response?.data?.error || 'Check your credentials');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.box}>
        <Text style={font.h1}>Civilo</Text>
        <Text style={styles.tag}>Find trusted construction pros, fast.</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone (10 digits)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={[styles.btn, submitting && { opacity: 0.6 }]} onPress={login} disabled={submitting}>
          <Text style={styles.btnText}>{submitting ? 'Logging in...' : 'Log in'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Main')}>
          <Text style={styles.skip}>Skip for now (browse only)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center' },
  box: { padding: spacing.lg },
  tag: { color: colors.textMuted, marginBottom: spacing.lg, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md, ...font.body,
  },
  btn: {
    backgroundColor: colors.primary, padding: spacing.md,
    borderRadius: radius.md, alignItems: 'center',
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  skip: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.md },
});
