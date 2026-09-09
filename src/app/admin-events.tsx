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

export default function AdminEventsScreen() {
  const [events, setEvents] =
    useState<Event[]>([]);

  const [emoji, setEmoji] =
    useState('📅');

  const [date, setDate] =
    useState('');

  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [time, setTime] =
    useState('');

  const [location, setLocation] =
    useState('');

  // --------------------------------
  // LOAD EVENTS
  // --------------------------------

  useFocusEffect(
    useCallback(() => {
      const loadEvents = async () => {
        const savedEvents =
          await getData<Event[]>(
            EVENTS_KEY,
          );

        if (savedEvents) {
          setEvents(savedEvents);
        } else {
          setEvents([]);
        }
      };

      loadEvents();
    }, [])
  );

  // --------------------------------
  // CREATE EVENT
  // --------------------------------

  const createEvent = async () => {
    if (
      !date.trim() ||
      !title.trim() ||
      !description.trim() ||
      !time.trim() ||
      !location.trim()
    ) {
      Alert.alert(
        'Missing Details',
        'Please fill in all event details.',
      );

      return;
    }

    const highestId =
      events.reduce(
        (max, event) =>
          event.id > max
            ? event.id
            : max,
        0,
      );

    const newEvent: Event = {
      id: highestId + 1,

      emoji:
        emoji.trim() || '📅',

      date: date.trim(),

      title: title.trim(),

      description:
        description.trim(),

      time: time.trim(),

      location:
        location.trim(),

      registered: 0,
    };

    const updatedEvents = [
      newEvent,
      ...events,
    ];

    setEvents(updatedEvents);

    await saveData(
      EVENTS_KEY,
      updatedEvents,
    );

    // Clear form
    setEmoji('📅');
    setDate('');
    setTitle('');
    setDescription('');
    setTime('');
    setLocation('');

    Alert.alert(
      'Event Created',
      'The event has been created successfully.',
    );
  };

  // --------------------------------
  // DELETE EVENT
  // --------------------------------

  const deleteEvent = (
    event: Event,
  ) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            const updatedEvents =
              events.filter(
                (item) =>
                  item.id !== event.id,
              );

            setEvents(updatedEvents);

            await saveData(
              EVENTS_KEY,
              updatedEvents,
            );

            Alert.alert(
              'Deleted',
              'Event has been deleted successfully.',
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
            Manage Events
          </Text>

          <Text style={styles.subtitle}>
            Create and manage community events
          </Text>
        </View>

        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>
            ADMIN
          </Text>
        </View>
      </View>

      {/* CREATE EVENT */}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          Create Event
        </Text>

        {/* Emoji */}

        <Text style={styles.label}>
          Event Icon
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: 🎉"
          placeholderTextColor="#94A3B8"
          value={emoji}
          onChangeText={setEmoji}
        />

        {/* Date */}

        <Text style={styles.label}>
          Date
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: July 30"
          placeholderTextColor="#94A3B8"
          value={date}
          onChangeText={setDate}
        />

        {/* Title */}

        <Text style={styles.label}>
          Event Title
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter event title"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description */}

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          style={styles.messageInput}
          placeholder="Describe the event"
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        {/* Time */}

        <Text style={styles.label}>
          Time
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: 6:00 PM"
          placeholderTextColor="#94A3B8"
          value={time}
          onChangeText={setTime}
        />

        {/* Location */}

        <Text style={styles.label}>
          Location
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: Community Hall"
          placeholderTextColor="#94A3B8"
          value={location}
          onChangeText={setLocation}
        />

        {/* CREATE */}

        <Pressable
          style={styles.createButton}
          onPress={createEvent}
        >
          <Text style={styles.createButtonText}>
            + Create Event
          </Text>
        </Pressable>
      </View>

      {/* EVENTS */}

      <Text style={styles.sectionTitle}>
        All Events
      </Text>

      {events.map((event) => (
        <View
          key={event.id}
          style={styles.card}
        >
          <View style={styles.cardTopRow}>
            <Text style={styles.eventEmoji}>
              {event.emoji}
            </Text>

            <View style={styles.idBadge}>
              <Text style={styles.idText}>
                EVENT-{String(
                  event.id,
                ).padStart(3, '0')}
              </Text>
            </View>
          </View>

          <Text style={styles.date}>
            📅 {event.date}
          </Text>

          <Text style={styles.cardTitle}>
            {event.title}
          </Text>

          <Text style={styles.cardDescription}>
            {event.description}
          </Text>

          <View style={styles.detailsBox}>
            <Text style={styles.detail}>
              🕐 {event.time}
            </Text>

            <Text style={styles.detail}>
              📍 {event.location}
            </Text>

            <Text style={styles.detail}>
              👥 {event.registered} residents
              registered
            </Text>
          </View>

          <Pressable
            style={styles.deleteButton}
            onPress={() =>
              deleteEvent(event)
            }
          >
            <Text style={styles.deleteText}>
              🗑️ Delete Event
            </Text>
          </Pressable>
        </View>
      ))}

      {events.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📅
          </Text>

          <Text style={styles.emptyTitle}>
            No Events
          </Text>

          <Text style={styles.emptyText}>
            Create your first community event above.
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
    paddingTop: 55,
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

  createButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 30,
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

  eventEmoji: {
    fontSize: 38,
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

  date: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '700',
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },

  cardDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 18,
  },

  detailsBox: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 15,
    marginBottom: 18,
  },

  detail: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 8,
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