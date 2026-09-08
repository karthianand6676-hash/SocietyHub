import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function BookingScreen() {
  const params = useLocalSearchParams();

  const facility =
    typeof params.facility === 'string'
      ? params.facility
      : 'Facility';

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const confirmBooking = () => {
    if (!date || !time) {
      Alert.alert(
        'Missing Details',
        'Please enter both date and time.'
      );
      return;
    }

    Alert.alert(
      'Booking Confirmed',
      `${facility} has been booked successfully.\n\nDate: ${date}\nTime: ${time}`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Book Facility</Text>

      <Text style={styles.subtitle}>
        Reserve a society facility
      </Text>

      <View style={styles.facilityCard}>

        <Text style={styles.icon}>🏢</Text>

        <Text style={styles.facilityTitle}>
          {facility}
        </Text>

        <Text style={styles.facilitySubtitle}>
          Select your preferred date and time
        </Text>

      </View>

      <View style={styles.form}>

        <Text style={styles.label}>Date</Text>

        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Example: 20/09/2026"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Time</Text>

        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="Example: 10:00 AM"
          placeholderTextColor="#94A3B8"
        />

        <Pressable
          style={styles.confirmButton}
          onPress={confirmBooking}
        >
          <Text style={styles.confirmText}>
            Confirm Booking
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 50,
  },

  subtitle: {
    fontSize: 18,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 30,
  },

  facilityCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
  },

  icon: {
    fontSize: 55,
    marginBottom: 15,
  },

  facilityTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },

  facilitySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 22,
  },

  confirmButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 40,
  },

  backText: {
    color: '#64748B',
    fontSize: 17,
  },
});