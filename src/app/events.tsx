import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import {
  useCallback,
  useState,
} from 'react';

import {
  useFocusEffect,
} from 'expo-router';

import {
  getData,
  saveData,
} from '../data/storage';

type Event = {
  id: number;
  emoji: string;
  date: string;
  title: string;
  description: string;
  time: string;
  location: string;
  registered: number;
};

const EVENTS_KEY = 'events';
const REGISTERED_EVENTS_KEY =
  'registeredEvents';

const initialEvents: Event[] = [
  {
    id: 1,
    emoji: '📅',
    date: 'July 17',
    title: 'Society Meeting',
    description:
      'Monthly society meeting will be held this Sunday.',
    time: '6:00 PM',
    location: 'Community Hall',
    registered: 24,
  },
  {
    id: 2,
    emoji: '🎉',
    date: 'July 20',
    title: 'Community Gathering',
    description:
      'Join your neighbours for a community gathering.',
    time: '7:00 PM',
    location: 'Society Garden',
    registered: 19,
  },
  {
    id: 3,
    emoji: '🏆',
    date: 'July 25',
    title: 'Sports Day',
    description:
      'A fun-filled sports day for all society residents.',
    time: '9:00 AM',
    location: 'Society Ground',
    registered: 33,
  },
];

export default function EventsScreen() {
  const [events, setEvents] =
    useState<Event[]>([]);

  const [
    registeredEvents,
    setRegisteredEvents,
  ] = useState<number[]>([]);

  // Load whenever screen becomes active
  useFocusEffect(
    useCallback(() => {
      const loadEventData = async () => {
        const savedEvents =
          await getData<Event[]>(
            EVENTS_KEY,
          );

        const savedRegisteredEvents =
          await getData<number[]>(
            REGISTERED_EVENTS_KEY,
          );

        if (savedEvents) {
          setEvents(savedEvents);
        } else {
          setEvents(initialEvents);

          await saveData(
            EVENTS_KEY,
            initialEvents,
          );
        }

        if (savedRegisteredEvents) {
          setRegisteredEvents(
            savedRegisteredEvents,
          );
        } else {
          setRegisteredEvents([]);
        }
      };

      loadEventData();
    }, [])
  );

  // --------------------------------
  // REGISTER FOR EVENT
  // --------------------------------

  const registerForEvent = async (
    eventId: number,
  ) => {
    if (
      registeredEvents.includes(eventId)
    ) {
      return;
    }

    const selectedEvent =
      events.find(
        (event) =>
          event.id === eventId,
      );

    if (!selectedEvent) {
      return;
    }

    const updatedRegisteredEvents = [
      ...registeredEvents,
      eventId,
    ];

    const updatedEvents =
      events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              registered:
                event.registered + 1,
            }
          : event,
      );

    setRegisteredEvents(
      updatedRegisteredEvents,
    );

    setEvents(updatedEvents);

    await saveData(
      REGISTERED_EVENTS_KEY,
      updatedRegisteredEvents,
    );

    await saveData(
      EVENTS_KEY,
      updatedEvents,
    );

    Alert.alert(
      'Registration Successful',
      `You have registered for ${selectedEvent.title}.\n\nDate: ${selectedEvent.date}\nTime: ${selectedEvent.time}`,
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Events
      </Text>

      <Text style={styles.subtitle}>
        Upcoming society events
      </Text>

      {events.map((event) => {
        const isRegistered =
          registeredEvents.includes(
            event.id,
          );

        return (
          <View
            style={styles.card}
            key={event.id}
          >
            <Text style={styles.date}>
              {event.emoji} {event.date}
            </Text>

            <Text style={styles.cardTitle}>
              {event.title}
            </Text>

            <Text style={styles.cardText}>
              {event.description}
            </Text>

            <View style={styles.details}>
              <Text style={styles.detail}>
                🕐 {event.time}
              </Text>

              <Text style={styles.detail}>
                📍 {event.location}
              </Text>
            </View>

            <Text
              style={styles.participants}
            >
              👥 {event.registered} residents
              registered
            </Text>

            <Pressable
              style={[
                styles.registerButton,
                isRegistered &&
                  styles.registeredButton,
              ]}
              onPress={() =>
                registerForEvent(
                  event.id,
                )
              }
              disabled={isRegistered}
            >
              <Text
                style={[
                  styles.buttonText,
                  isRegistered &&
                    styles.registeredButtonText,
                ]}
              >
                {isRegistered
                  ? '✓ Registered'
                  : 'Register for Event'}
              </Text>
            </Pressable>
          </View>
        );
      })}

      {events.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📅
          </Text>

          <Text style={styles.emptyTitle}>
            No Upcoming Events
          </Text>

          <Text style={styles.emptyText}>
            There are currently no upcoming society
            events.
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
    paddingTop: 60,
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
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  date: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '700',
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },

  cardText: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 18,
  },

  details: {
    marginBottom: 18,
  },

  detail: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 8,
  },

  participants: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 18,
  },

  registerButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registeredButton: {
    backgroundColor: '#DCFCE7',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  registeredButtonText: {
    color: '#16A34A',
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