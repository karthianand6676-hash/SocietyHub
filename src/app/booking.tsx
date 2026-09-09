import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getData,
  saveData,
} from '../data/storage';

type Booking = {
  id: string;
  facility: string;
  date: string;
  time: string;
};

type ProfileData = {
  name: string;
  email: string;
  flat: string;
};

const PROFILE_KEY = 'profileData';
const BOOKING_PREFIX = 'facilityBookings_';

export default function BookingScreen() {
  const params = useLocalSearchParams();

  const facility =
    typeof params.facility === 'string'
      ? params.facility
      : 'Facility';

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookings, setBookings] =
    useState<Booking[]>([]);
  const [userEmail, setUserEmail] =
    useState('');

  // ========================================
  // LOAD CURRENT USER BOOKINGS
  // ========================================

  useFocusEffect(
    useCallback(() => {
      const loadBookings = async () => {
        const profile =
          await getData<ProfileData>(
            PROFILE_KEY
          );

        const email =
          profile?.email
            ?.trim()
            .toLowerCase() || '';

        setUserEmail(email);

        if (!email) {
          setBookings([]);
          return;
        }

        const bookingsKey =
          `${BOOKING_PREFIX}${email}`;

        const savedBookings =
          await getData<Booking[]>(
            bookingsKey
          );

        if (savedBookings) {
          setBookings(savedBookings);
        } else {
          setBookings([]);
        }
      };

      loadBookings();
    }, [])
  );

  // ========================================
  // CONFIRM BOOKING
  // ========================================

  const confirmBooking = async () => {
    if (!userEmail) {
      Alert.alert(
        'Login Required',
        'Please login before booking a facility.'
      );

      return;
    }

    if (
      !date.trim() ||
      !time.trim()
    ) {
      Alert.alert(
        'Missing Details',
        'Please enter both date and time.'
      );

      return;
    }

    const bookingDate =
      date.trim().toLowerCase();

    const bookingTime =
      time.trim().toLowerCase();

    const bookingFacility =
      facility.trim().toLowerCase();

    try {
      // ========================================
      // CHECK ALL RESIDENT BOOKINGS
      // ========================================

      const allKeys =
        await AsyncStorage.getAllKeys();

      const bookingKeys =
        allKeys.filter((key) =>
          key.startsWith(BOOKING_PREFIX)
        );

      let facilityAlreadyBooked =
        false;

      for (const key of bookingKeys) {
        const residentBookings =
          await getData<Booking[]>(key);

        if (!residentBookings) {
          continue;
        }

        const conflict =
          residentBookings.some(
            (booking) =>
              booking.facility
                .trim()
                .toLowerCase() ===
                bookingFacility &&
              booking.date
                .trim()
                .toLowerCase() ===
                bookingDate &&
              booking.time
                .trim()
                .toLowerCase() ===
                bookingTime
          );

        if (conflict) {
          facilityAlreadyBooked = true;
          break;
        }
      }

      // ========================================
      // PREVENT DUPLICATE BOOKING
      // ========================================

      if (facilityAlreadyBooked) {
        Alert.alert(
          'Facility Already Booked',
          `${facility} is already booked for ${date.trim()} at ${time.trim()}.\n\nPlease choose another date or time.`
        );

        return;
      }

      // ========================================
      // CREATE NEW BOOKING
      // ========================================

      const newBooking: Booking = {
        id: `BOOK-${Date.now()}`,
        facility: facility,
        date: date.trim(),
        time: time.trim(),
      };

      const updatedBookings = [
        newBooking,
        ...bookings,
      ];

      // Update screen
      setBookings(updatedBookings);

      // Save only for current user
      const bookingsKey =
        `${BOOKING_PREFIX}${userEmail}`;

      await saveData(
        bookingsKey,
        updatedBookings
      );

      // Clear inputs
      setDate('');
      setTime('');

      // Success message
      Alert.alert(
        'Booking Confirmed',
        `${facility} has been booked successfully.\n\nDate: ${newBooking.date}\nTime: ${newBooking.time}`
      );

    } catch (error) {
      console.log(
        'Error checking booking:',
        error
      );

      Alert.alert(
        'Booking Error',
        'Unable to check facility availability. Please try again.'
      );
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <Text style={styles.title}>
        Book Facility
      </Text>

      <Text style={styles.subtitle}>
        Reserve a society facility
      </Text>

      {/* FACILITY CARD */}

      <View style={styles.facilityCard}>

        <Text style={styles.icon}>
          🏢
        </Text>

        <Text style={styles.facilityTitle}>
          {facility}
        </Text>

        <Text style={styles.facilitySubtitle}>
          Select your preferred date and time
        </Text>

      </View>

      {/* BOOKING FORM */}

      <View style={styles.form}>

        {/* DATE */}

        <Text style={styles.label}>
          Date
        </Text>

        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Example: 20/09/2026"
          placeholderTextColor="#94A3B8"
        />

        {/* TIME */}

        <Text style={styles.label}>
          Time
        </Text>

        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="Example: 10:00 AM"
          placeholderTextColor="#94A3B8"
        />

        {/* CONFIRM */}

        <Pressable
          style={styles.confirmButton}
          onPress={confirmBooking}
        >
          <Text style={styles.confirmText}>
            Confirm Booking
          </Text>
        </Pressable>

      </View>

      {/* MY BOOKINGS */}

      {bookings.length > 0 && (
        <View style={styles.bookingsSection}>

          <Text style={styles.sectionTitle}>
            My Bookings
          </Text>

          {bookings.map((booking) => (

            <View
              style={styles.bookingCard}
              key={booking.id}
            >

              <Text
                style={styles.bookingFacility}
              >
                🏢 {booking.facility}
              </Text>

              <View
                style={styles.divider}
              />

              <Text
                style={styles.bookingDetail}
              >
                📅 {booking.date}
              </Text>

              <Text
                style={styles.bookingDetail}
              >
                🕐 {booking.time}
              </Text>

              <View
                style={styles.confirmedBadge}
              >
                <Text
                  style={styles.confirmedText}
                >
                  ✓ Booking Confirmed
                </Text>
              </View>

            </View>

          ))}

        </View>
      )}

      {/* BACK */}

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Back
        </Text>
      </Pressable>

    </ScrollView>
  );
}

// ========================================
// STYLES
// ========================================

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
    color: '#0F172A',
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

  bookingsSection: {
    marginTop: 35,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 18,
  },

  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
  },

  bookingFacility: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },

  bookingDetail: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 10,
  },

  confirmedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 8,
  },

  confirmedText: {
    color: '#16A34A',
    fontSize: 14,
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