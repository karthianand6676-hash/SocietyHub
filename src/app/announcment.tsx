import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getData, saveData } from '../data/storage';

type Announcement = {
  id: number;
  title: string;
  message: string;
  date: string;
  priority: 'Important' | 'Normal';
};

type ProfileData = {
  name: string;
  email: string;
  flat: string;
};

const ANNOUNCEMENTS_KEY = 'announcements';
const PROFILE_KEY = 'profileData';

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Society Meeting',
    message:
      'Monthly society meeting will be held this Sunday. All residents are requested to attend.',
    date: '08 Sept 2026',
    priority: 'Important',
  },
  {
    id: 2,
    title: 'Water Maintenance',
    message:
      'Water maintenance work is scheduled tomorrow. Water supply may be temporarily affected.',
    date: '07 Sept 2026',
    priority: 'Important',
  },
  {
    id: 3,
    title: 'Parking Notice',
    message:
      'Residents are requested to park their vehicles only in the designated parking areas.',
    date: '05 Sept 2026',
    priority: 'Normal',
  },
];

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  const [readAnnouncements, setReadAnnouncements] =
    useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadAnnouncements = async () => {
        // Get current user's profile
        const profile =
          await getData<ProfileData>(PROFILE_KEY);

        const userEmail =
          profile?.email?.trim().toLowerCase() || 'guest';

        // User-specific read status key
        const READ_ANNOUNCEMENTS_KEY =
          `readAnnouncements_${userEmail}`;

        // Load shared announcements
        const savedAnnouncements =
          await getData<Announcement[]>(
            ANNOUNCEMENTS_KEY
          );

        if (savedAnnouncements) {
          setAnnouncements(savedAnnouncements);
        } else {
          setAnnouncements(initialAnnouncements);

          await saveData(
            ANNOUNCEMENTS_KEY,
            initialAnnouncements
          );
        }

        // Load this user's read status
        const savedReadAnnouncements =
          await getData<number[]>(
            READ_ANNOUNCEMENTS_KEY
          );

        if (savedReadAnnouncements) {
          setReadAnnouncements(
            savedReadAnnouncements
          );
        } else {
          setReadAnnouncements([]);
        }
      };

      loadAnnouncements();
    }, [])
  );

  const openAnnouncement = async (
    announcement: Announcement
  ) => {
    // Get current user
    const profile =
      await getData<ProfileData>(PROFILE_KEY);

    const userEmail =
      profile?.email?.trim().toLowerCase() || 'guest';

    // User-specific read status
    const READ_ANNOUNCEMENTS_KEY =
      `readAnnouncements_${userEmail}`;

    if (
      !readAnnouncements.includes(
        announcement.id
      )
    ) {
      const updatedReadAnnouncements = [
        ...readAnnouncements,
        announcement.id,
      ];

      setReadAnnouncements(
        updatedReadAnnouncements
      );

      await saveData(
        READ_ANNOUNCEMENTS_KEY,
        updatedReadAnnouncements
      );
    }

    Alert.alert(
      announcement.title,
      `${announcement.message}\n\nDate: ${announcement.date}`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Announcements
      </Text>

      <Text style={styles.subtitle}>
        Society announcements and important updates
      </Text>

      <Text style={styles.sectionTitle}>
        Latest Announcements
      </Text>

      {announcements.map((announcement) => {
        const isRead =
          readAnnouncements.includes(
            announcement.id
          );

        return (
          <Pressable
            key={announcement.id}
            style={[
              styles.card,
              !isRead && styles.unreadCard,
            ]}
            onPress={() =>
              openAnnouncement(announcement)
            }
          >
            <View style={styles.topRow}>
              <Text style={styles.icon}>
                📢
              </Text>

              <View
                style={[
                  styles.priorityBadge,
                  announcement.priority ===
                    'Important'
                    ? styles.importantBadge
                    : styles.normalBadge,
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
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

            <Text style={styles.cardText}>
              {announcement.message}
            </Text>

            <View style={styles.bottomRow}>
              <Text style={styles.date}>
                📅 {announcement.date}
              </Text>

              <Text
                style={[
                  styles.readStatus,
                  isRead &&
                    styles.readStatusDone,
                ]}
              >
                {isRead
                  ? '✓ Read'
                  : '● Unread'}
              </Text>
            </View>
          </Pressable>
        );
      })}

      {announcements.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📢
          </Text>

          <Text style={styles.emptyTitle}>
            No Announcements
          </Text>

          <Text style={styles.emptyText}>
            There are currently no announcements.
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
    lineHeight: 25,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  unreadCard: {
    borderColor: '#93C5FD',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  icon: {
    fontSize: 38,
  },

  priorityBadge: {
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

  priorityText: {
    fontSize: 13,
    fontWeight: '700',
  },

  importantText: {
    color: '#DC2626',
  },

  normalText: {
    color: '#475569',
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
    marginBottom: 20,
  },

  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  date: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },

  readStatus: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },

  readStatusDone: {
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
  },

  bottomSpace: {
    height: 50,
  },
});