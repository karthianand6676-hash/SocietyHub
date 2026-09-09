import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';

import {
  useCallback,
  useState,
} from 'react';

import {
  router,
  useFocusEffect,
} from 'expo-router';

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

const FACILITIES_KEY = 'facilities';

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

export default function FacilitiesScreen() {
  const [facilities, setFacilities] =
    useState<Facility[]>([]);

  // Load facilities whenever the screen becomes active
  useFocusEffect(
    useCallback(() => {
      const loadFacilities = async () => {
        const savedFacilities =
          await getData<Facility[]>(
            FACILITIES_KEY,
          );

        if (savedFacilities) {
          setFacilities(savedFacilities);
        } else {
          setFacilities(initialFacilities);

          await saveData(
            FACILITIES_KEY,
            initialFacilities,
          );
        }
      };

      loadFacilities();
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Facilities
      </Text>

      <Text style={styles.subtitle}>
        Book and use society facilities
      </Text>

      {facilities.map((facility) => (
        <View
          style={styles.card}
          key={facility.id}
        >
          <Text style={styles.icon}>
            {facility.icon}
          </Text>

          <Text style={styles.cardTitle}>
            {facility.name}
          </Text>

          <Text style={styles.cardSubtitle}>
            {facility.description}
          </Text>

          <Pressable
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: '/booking',
                params: {
                  facility:
                    facility.name,
                },
              })
            }
          >
            <Text style={styles.buttonText}>
              Book Now
            </Text>
          </Pressable>
        </View>
      ))}

      {facilities.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            🏢
          </Text>

          <Text style={styles.emptyTitle}>
            No Facilities Available
          </Text>

          <Text style={styles.emptyText}>
            There are currently no facilities
            available for booking.
          </Text>
        </View>
      )}

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Back
        </Text>
      </Pressable>

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

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },

  icon: {
    fontSize: 45,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  cardSubtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 20,
  },

  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
    fontSize: 45,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },

  backButton: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },

  backText: {
    color: '#64748B',
    fontSize: 17,
  },

  bottomSpace: {
    height: 40,
  },
});