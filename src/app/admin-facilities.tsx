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
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';

import {
  getData,
  saveData,
} from '../data/storage';

type Facility = {
  id: number;
  icon: string;
  name: string;
  description: string;
};

type Booking = {
  id: string;
  facility: string;
  date: string;
  time: string;
};

const FACILITIES_KEY = 'facilities';
const BOOKINGS_KEY = 'facilityBookings';

const initialFacilities: Facility[] = [
  {
    id: 1,
    icon: '🏢',
    name: 'Community Hall',
    description:
      'Available for meetings and functions',
  },
  {
    id: 2,
    icon: '🏊',
    name: 'Swimming Pool',
    description:
      'Enjoy the society swimming pool',
  },
  {
    id: 3,
    icon: '🏋️',
    name: 'Gym',
    description:
      'Fitness facility for residents',
  },
];

export default function AdminFacilitiesScreen() {
  const [facilities, setFacilities] =
    useState<Facility[]>([]);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [icon, setIcon] =
    useState('🏢');

  const [name, setName] =
    useState('');

  const [description, setDescription] =
    useState('');

  // --------------------------------
  // LOAD DATA
  // --------------------------------

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const savedFacilities =
          await getData<Facility[]>(
            FACILITIES_KEY,
          );

        const savedBookings =
          await getData<Booking[]>(
            BOOKINGS_KEY,
          );

        if (savedFacilities) {
          setFacilities(savedFacilities);
        } else {
          setFacilities(
            initialFacilities,
          );

          await saveData(
            FACILITIES_KEY,
            initialFacilities,
          );
        }

        if (savedBookings) {
          setBookings(savedBookings);
        } else {
          setBookings([]);
        }
      };

      loadData();
    }, [])
  );

  // --------------------------------
  // ADD FACILITY
  // --------------------------------

  const addFacility = async () => {
    if (
      !name.trim() ||
      !description.trim()
    ) {
      Alert.alert(
        'Missing Details',
        'Please enter the facility name and description.',
      );

      return;
    }

    const highestId =
      facilities.reduce(
        (max, facility) =>
          facility.id > max
            ? facility.id
            : max,
        0,
      );

    const newFacility: Facility = {
      id: highestId + 1,
      icon: icon.trim() || '🏢',
      name: name.trim(),
      description:
        description.trim(),
    };

    const updatedFacilities = [
      newFacility,
      ...facilities,
    ];

    setFacilities(
      updatedFacilities,
    );

    await saveData(
      FACILITIES_KEY,
      updatedFacilities,
    );

    setIcon('🏢');
    setName('');
    setDescription('');

    Alert.alert(
      'Facility Added',
      `${newFacility.name} has been added successfully.`,
    );
  };

  // --------------------------------
  // DELETE FACILITY
  // --------------------------------

  const deleteFacility = (
    facility: Facility,
  ) => {
    const hasBooking =
      bookings.some(
        (booking) =>
          booking.facility ===
          facility.name,
      );

    if (hasBooking) {
      Alert.alert(
        'Cannot Delete',
        `${facility.name} has existing bookings. Cancel those bookings first before deleting the facility.`,
      );

      return;
    }

    Alert.alert(
      'Delete Facility',
      `Are you sure you want to delete "${facility.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedFacilities =
              facilities.filter(
                (item) =>
                  item.id !==
                  facility.id,
              );

            setFacilities(
              updatedFacilities,
            );

            await saveData(
              FACILITIES_KEY,
              updatedFacilities,
            );

            Alert.alert(
              'Deleted',
              'Facility deleted successfully.',
            );
          },
        },
      ],
    );
  };

  // --------------------------------
  // DELETE BOOKING
  // --------------------------------

  const deleteBooking = (
    booking: Booking,
  ) => {
    Alert.alert(
      'Cancel Booking',
      `Cancel booking for ${booking.facility} on ${booking.date}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: async () => {
            const updatedBookings =
              bookings.filter(
                (item) =>
                  item.id !==
                  booking.id,
              );

            setBookings(
              updatedBookings,
            );

            await saveData(
              BOOKINGS_KEY,
              updatedBookings,
            );

            Alert.alert(
              'Booking Cancelled',
              'The booking has been cancelled.',
            );
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* BACK */}

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Admin Dashboard
        </Text>
      </Pressable>

      {/* HEADER */}

      <View style={styles.headerRow}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            Manage Facilities
          </Text>

          <Text style={styles.subtitle}>
            Manage society facilities and resident
            bookings
          </Text>
        </View>

        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>
            ADMIN
          </Text>
        </View>
      </View>

      {/* ADD FACILITY */}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          Add Facility
        </Text>

        <Text style={styles.label}>
          Facility Icon
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: 🏢"
          placeholderTextColor="#94A3B8"
          value={icon}
          onChangeText={setIcon}
        />

        <Text style={styles.label}>
          Facility Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: Tennis Court"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          style={styles.messageInput}
          placeholder="Describe the facility"
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <Pressable
          style={styles.addButton}
          onPress={addFacility}
        >
          <Text style={styles.addButtonText}>
            + Add Facility
          </Text>
        </Pressable>
      </View>

      {/* FACILITIES */}

      <Text style={styles.sectionTitle}>
        Society Facilities
      </Text>

      {facilities.map((facility) => (
        <View
          style={styles.card}
          key={facility.id}
        >
          <View style={styles.cardTopRow}>
            <Text style={styles.icon}>
              {facility.icon}
            </Text>

            <View style={styles.idBadge}>
              <Text style={styles.idText}>
                FAC-
                {String(
                  facility.id,
                ).padStart(3, '0')}
              </Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>
            {facility.name}
          </Text>

          <Text style={styles.cardDescription}>
            {facility.description}
          </Text>

          <Pressable
            style={styles.deleteButton}
            onPress={() =>
              deleteFacility(
                facility,
              )
            }
          >
            <Text style={styles.deleteText}>
              🗑️ Delete Facility
            </Text>
          </Pressable>
        </View>
      ))}

      {/* BOOKINGS */}

      <Text style={styles.sectionTitle}>
        Resident Bookings
      </Text>

      {bookings.map((booking) => (
        <View
          style={styles.bookingCard}
          key={booking.id}
        >
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle}>
              🏢 {booking.facility}
            </Text>

            <Text style={styles.bookingId}>
              {booking.id}
            </Text>
          </View>

          <View style={styles.bookingDetails}>
            <Text style={styles.bookingDetail}>
              📅 {booking.date}
            </Text>

            <Text style={styles.bookingDetail}>
              🕐 {booking.time}
            </Text>
          </View>

          <Pressable
            style={styles.cancelButton}
            onPress={() =>
              deleteBooking(
                booking,
              )
            }
          >
            <Text style={styles.cancelText}>
              Cancel Booking
            </Text>
          </Pressable>
        </View>
      ))}

      {bookings.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📋
          </Text>

          <Text style={styles.emptyTitle}>
            No Bookings
          </Text>

          <Text style={styles.emptyText}>
            There are currently no resident
            facility bookings.
          </Text>
        </View>
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    paddingTop: 50,
  },

  backButton: {
    marginBottom: 20,
  },

  backText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '700',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },

  headerContent: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 17,
    color: '#64748B',
    lineHeight: 24,
  },

  adminBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  adminBadgeText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '800',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 20,
    padding: 22,
    marginBottom: 30,
  },

  formTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },

  messageInput: {
    height: 110,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },

  addButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 29,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  icon: {
    fontSize: 40,
  },

  idBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  idText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  cardDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 18,
  },

  deleteButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },

  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
  },

  bookingHeader: {
    marginBottom: 15,
  },

  bookingTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 7,
  },

  bookingId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },

  bookingDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 15,
    marginBottom: 18,
  },

  bookingDetail: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 8,
  },

  cancelButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },

  bottomSpace: {
    height: 50,
  },
});