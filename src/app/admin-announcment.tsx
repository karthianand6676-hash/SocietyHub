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

import { useCallback, useState } from 'react';
import { getData, saveData } from '../data/storage';

type Announcement = {
  id: number;
  title: string;
  message: string;
  date: string;
  priority: 'Important' | 'Normal';
};

const ANNOUNCEMENTS_KEY = 'announcements';

export default function AdminAnnouncementsScreen() {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const [priority, setPriority] =
    useState<'Important' | 'Normal'>('Normal');

  useFocusEffect(
    useCallback(() => {
      const loadAnnouncements = async () => {
        const savedAnnouncements =
          await getData<Announcement[]>(
            ANNOUNCEMENTS_KEY,
          );

        if (savedAnnouncements) {
          setAnnouncements(savedAnnouncements);
        } else {
          setAnnouncements([]);
        }
      };

      loadAnnouncements();
    }, [])
  );

  // --------------------------------
  // ADD ANNOUNCEMENT
  // --------------------------------

  const addAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert(
        'Missing Details',
        'Please enter both title and message.',
      );
      return;
    }

    const highestId = announcements.reduce(
      (max, item) =>
        item.id > max ? item.id : max,
      0,
    );

    const newAnnouncement: Announcement = {
      id: highestId + 1,

      title: title.trim(),

      message: message.trim(),

      date: new Date().toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        },
      ),

      priority,
    };

    const updatedAnnouncements = [
      newAnnouncement,
      ...announcements,
    ];

    setAnnouncements(
      updatedAnnouncements,
    );

    await saveData(
      ANNOUNCEMENTS_KEY,
      updatedAnnouncements,
    );

    setTitle('');
    setMessage('');
    setPriority('Normal');

    Alert.alert(
      'Published',
      'Announcement has been published successfully.',
    );
  };

  // --------------------------------
  // DELETE ANNOUNCEMENT
  // --------------------------------

  const deleteAnnouncement = (
    announcement: Announcement,
  ) => {
    Alert.alert(
      'Delete Announcement',
      `Delete "${announcement.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            const updatedAnnouncements =
              announcements.filter(
                (item) =>
                  item.id !== announcement.id,
              );

            setAnnouncements(
              updatedAnnouncements,
            );

            await saveData(
              ANNOUNCEMENTS_KEY,
              updatedAnnouncements,
            );

            Alert.alert(
              'Deleted',
              'Announcement has been deleted.',
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

      {/* Header */}

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Admin Dashboard
        </Text>
      </Pressable>

      <View style={styles.headerRow}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            Manage Announcements
          </Text>

          <Text style={styles.subtitle}>
            Create and manage society announcements
          </Text>
        </View>

        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>
            ADMIN
          </Text>
        </View>
      </View>

      {/* CREATE */}

      <View style={styles.formCard}>

        <Text style={styles.formTitle}>
          Create Announcement
        </Text>

        <Text style={styles.label}>
          Title
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter announcement title"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>
          Message
        </Text>

        <TextInput
          style={styles.messageInput}
          placeholder="Enter announcement message"
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />

        <Text style={styles.label}>
          Priority
        </Text>

        <View style={styles.priorityRow}>

          <Pressable
            style={[
              styles.priorityButton,
              styles.normalButton,
              priority === 'Normal' &&
                styles.selectedButton,
            ]}
            onPress={() =>
              setPriority('Normal')
            }
          >
            <Text
              style={[
                styles.priorityButtonText,
                styles.normalText,
              ]}
            >
              Normal
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.priorityButton,
              styles.importantButton,
              priority === 'Important' &&
                styles.selectedButton,
            ]}
            onPress={() =>
              setPriority('Important')
            }
          >
            <Text
              style={[
                styles.priorityButtonText,
                styles.importantText,
              ]}
            >
              Important
            </Text>
          </Pressable>

        </View>

        <Pressable
          style={styles.publishButton}
          onPress={addAnnouncement}
        >
          <Text style={styles.publishText}>
            + Publish Announcement
          </Text>
        </Pressable>

      </View>

      {/* LIST */}

      <Text style={styles.sectionTitle}>
        Published Announcements
      </Text>

      {announcements.map((announcement) => (
        <View
          key={announcement.id}
          style={styles.card}
        >

          <View style={styles.cardTopRow}>

            <Text style={styles.icon}>
              📢
            </Text>

            <View
              style={[
                styles.badge,
                announcement.priority ===
                  'Important'
                  ? styles.importantBadge
                  : styles.normalBadge,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  announcement.priority ===
                    'Important'
                    ? styles.importantText
                    : styles.normalText,
                ]}
              >
                {announcement.priority}
              </Text>
            </View>

          </View>

          <Text style={styles.cardTitle}>
            {announcement.title}
          </Text>

          <Text style={styles.cardMessage}>
            {announcement.message}
          </Text>

          <Text style={styles.date}>
            📅 {announcement.date}
          </Text>

          <Pressable
            style={styles.deleteButton}
            onPress={() =>
              deleteAnnouncement(
                announcement,
              )
            }
          >
            <Text style={styles.deleteText}>
              🗑️ Delete Announcement
            </Text>
          </Pressable>

        </View>
      ))}

      {announcements.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📢
          </Text>

          <Text style={styles.emptyTitle}>
            No Announcements
          </Text>

          <Text style={styles.emptyText}>
            Create your first society announcement above.
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
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  messageInput: {
    height: 110,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  priorityButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  normalButton: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },

  importantButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },

  selectedButton: {
    borderWidth: 2,
  },

  priorityButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  normalText: {
    color: '#475569',
  },

  importantText: {
    color: '#DC2626',
  },

  publishButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  publishText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 18,
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
    fontSize: 36,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  importantBadge: {
    backgroundColor: '#FEE2E2',
  },

  normalBadge: {
    backgroundColor: '#E2E8F0',
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },

  cardMessage: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 18,
  },

  date: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
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