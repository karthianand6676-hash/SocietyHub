import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
  removeData,
} from '../../data/storage';

type ProfileData = {
  name: string;
  email: string;
  flat: string;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  date: string;
  priority?: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants?: number;
};

type Facility = {
  id: number;
  icon: string;
  name: string;
  description: string;
};

const PROFILE_KEY = 'profileData';
const LOGIN_KEY = 'isLoggedIn';

const ANNOUNCEMENTS_KEY = 'announcements';
const EVENTS_KEY = 'events';
const FACILITIES_KEY = 'facilities';

export default function HomeScreen() {
  // ========================================
  // PROFILE
  // ========================================

  const [profile, setProfile] =
    useState<ProfileData>({
      name: 'Karthikeyan',
      email: 'resident@example.com',
      flat: '2644',
    });

  // ========================================
  // SOCIETY COUNTS
  // ========================================

  const [announcementCount, setAnnouncementCount] =
    useState(0);

  const [eventCount, setEventCount] =
    useState(0);

  const [facilityCount, setFacilityCount] =
    useState(0);

  // ========================================
  // RECENT ANNOUNCEMENTS
  // ========================================

  const [recentAnnouncements, setRecentAnnouncements] =
    useState<Announcement[]>([]);

  const [loggingOut, setLoggingOut] =
    useState(false);

  // ========================================
  // LOAD HOME DATA
  // ========================================

  useFocusEffect(
    useCallback(() => {
      const loadHomeData = async () => {
        try {
          // --------------------------------
          // LOAD PROFILE
          // --------------------------------

          const savedProfile =
            await getData<ProfileData>(
              PROFILE_KEY
            );

          if (savedProfile) {
            setProfile(savedProfile);
          }

          // --------------------------------
          // LOAD ANNOUNCEMENTS
          // --------------------------------

          const announcements =
            await getData<Announcement[]>(
              ANNOUNCEMENTS_KEY
            );

          if (announcements) {
            setAnnouncementCount(
              announcements.length
            );

            // Show latest 2 announcements
            setRecentAnnouncements(
              announcements.slice(0, 2)
            );
          } else {
            setAnnouncementCount(0);
            setRecentAnnouncements([]);
          }

          // --------------------------------
          // LOAD EVENTS
          // --------------------------------

          const events =
            await getData<Event[]>(
              EVENTS_KEY
            );

          if (events) {
            setEventCount(
              events.length
            );
          } else {
            setEventCount(0);
          }

          // --------------------------------
          // LOAD FACILITIES
          // --------------------------------

          const facilities =
            await getData<Facility[]>(
              FACILITIES_KEY
            );

          if (facilities) {
            setFacilityCount(
              facilities.length
            );
          } else {
            setFacilityCount(0);
          }

        } catch (error) {
          console.log(
            'Error loading home data:',
            error
          );
        }
      };

      loadHomeData();
    }, [])
  );

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    await removeData(LOGIN_KEY);

    router.replace('/login');
  };

  // ========================================
  // UI
  // ========================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* ==================================
          HEADER
      ================================== */}

      <View style={styles.header}>

        <View>

          <Text style={styles.greeting}>
            Welcome back 👋
          </Text>

          <Text style={styles.name}>
            {profile.name}
          </Text>

          <Text style={styles.flat}>
            Flat {profile.flat}
          </Text>

        </View>

        <Pressable
          style={styles.profileButton}
          onPress={() =>
            router.push('/profile')
          }
        >
          <Text style={styles.profileText}>
            👤
          </Text>
        </Pressable>

      </View>

      {/* ==================================
          SOCIETY CARD
      ================================== */}

      <View style={styles.societyCard}>

        <Text style={styles.societyTitle}>
          SocietyHub
        </Text>

        <Text style={styles.societySubtitle}>
          Your community, connected.
        </Text>

        <View style={styles.societyDivider} />

        <Text style={styles.societyInfo}>
          Stay updated with your society activities,
          announcements and services.
        </Text>

      </View>

      {/* ==================================
          QUICK STATS
      ================================== */}

      <Text style={styles.sectionTitle}>
        Your Society
      </Text>

      <View style={styles.statsRow}>

        {/* ANNOUNCEMENTS */}

        <Pressable
          style={styles.statCard}
          onPress={() =>
            router.push('/announcment')
          }
        >

          <Text style={styles.statIcon}>
            📢
          </Text>

          <Text style={styles.statNumber}>
            {announcementCount}
          </Text>

          <Text style={styles.statLabel}>
            Updates
          </Text>

        </Pressable>

        {/* EVENTS */}

        <Pressable
          style={styles.statCard}
          onPress={() =>
            router.push('/events')
          }
        >

          <Text style={styles.statIcon}>
            📅
          </Text>

          <Text style={styles.statNumber}>
            {eventCount}
          </Text>

          <Text style={styles.statLabel}>
            Events
          </Text>

        </Pressable>

        {/* FACILITIES */}

        <Pressable
          style={styles.statCard}
          onPress={() =>
            router.push('/facilities')
          }
        >

          <Text style={styles.statIcon}>
            🏢
          </Text>

          <Text style={styles.statNumber}>
            {facilityCount}
          </Text>

          <Text style={styles.statLabel}>
            Facilities
          </Text>

        </Pressable>

      </View>

      {/* ==================================
          QUICK ACCESS
      ================================== */}

      <Text style={styles.sectionTitle}>
        Quick Access
      </Text>

      <View style={styles.grid}>

        {/* ANNOUNCEMENTS */}

        <Pressable
          style={styles.card}
          onPress={() =>
            router.push('/announcment')
          }
        >

          <Text style={styles.icon}>
            📢
          </Text>

          <Text style={styles.cardTitle}>
            Announcements
          </Text>

          <Text style={styles.cardSubtitle}>
            Society updates
          </Text>

        </Pressable>

        {/* COMPLAINTS */}

        <Pressable
          style={styles.card}
          onPress={() =>
            router.push('/complaints')
          }
        >

          <Text style={styles.icon}>
            📝
          </Text>

          <Text style={styles.cardTitle}>
            Complaints
          </Text>

          <Text style={styles.cardSubtitle}>
            Report an issue
          </Text>

        </Pressable>

        {/* EVENTS */}

        <Pressable
          style={styles.card}
          onPress={() =>
            router.push('/events')
          }
        >

          <Text style={styles.icon}>
            📅
          </Text>

          <Text style={styles.cardTitle}>
            Events
          </Text>

          <Text style={styles.cardSubtitle}>
            Upcoming events
          </Text>

        </Pressable>

        {/* FACILITIES */}

        <Pressable
          style={styles.card}
          onPress={() =>
            router.push('/facilities')
          }
        >

          <Text style={styles.icon}>
            🏢
          </Text>

          <Text style={styles.cardTitle}>
            Facilities
          </Text>

          <Text style={styles.cardSubtitle}>
            Book facilities
          </Text>

        </Pressable>

        {/* POLLS */}

        <Pressable
          style={styles.card}
          onPress={() =>
            router.push('/polls')
          }
        >

          <Text style={styles.icon}>
            🗳️
          </Text>

          <Text style={styles.cardTitle}>
            Polls
          </Text>

          <Text style={styles.cardSubtitle}>
            Give your opinion
          </Text>

        </Pressable>

        {/* PROFILE */}

        <Pressable
          style={styles.card}
          onPress={() =>
            router.push('/profile')
          }
        >

          <Text style={styles.icon}>
            👤
          </Text>

          <Text style={styles.cardTitle}>
            My Profile
          </Text>

          <Text style={styles.cardSubtitle}>
            Account details
          </Text>

        </Pressable>

      </View>

      {/* ==================================
          RECENT UPDATES
      ================================== */}

      <View style={styles.sectionHeader}>

        <Text style={styles.sectionTitle}>
          Recent Updates
        </Text>

        <Pressable
          onPress={() =>
            router.push('/announcment')
          }
        >

          <Text style={styles.viewText}>
            View All
          </Text>

        </Pressable>

      </View>

      {/* ==================================
          DYNAMIC RECENT ANNOUNCEMENTS
      ================================== */}

      {recentAnnouncements.length > 0 ? (

        recentAnnouncements.map(
          (announcement) => (

            <Pressable
              key={announcement.id}
              style={styles.updateCard}
              onPress={() =>
                router.push('/announcment')
              }
            >

              <Text style={styles.updateIcon}>
                📢
              </Text>

              <View
                style={styles.updateContent}
              >

                <Text
                  style={styles.updateTitle}
                >
                  {announcement.title}
                </Text>

                <Text
                  style={styles.updateText}
                  numberOfLines={2}
                >
                  {announcement.message}
                </Text>

                <Text
                  style={styles.updateDate}
                >
                  {announcement.date}
                </Text>

              </View>

            </Pressable>

          )
        )

      ) : (

        <View style={styles.emptyUpdateCard}>

          <Text style={styles.emptyUpdateIcon}>
            📢
          </Text>

          <Text style={styles.emptyUpdateText}>
            No recent announcements.
          </Text>

        </View>

      )}

      {/* ==================================
          LOGOUT
      ================================== */}

      <Pressable
        style={styles.logoutButton}
        onPress={() => {
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Logout',
                style: 'destructive',
                onPress: handleLogout,
              },
            ]
          );
        }}
      >

        <Text style={styles.logoutText}>
          Logout
        </Text>

      </Pressable>

      <View style={styles.bottomSpace} />

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
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },

  flat: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileText: {
    fontSize: 23,
  },

  societyCard: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    padding: 22,
    marginBottom: 28,
  },

  societyTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },

  societySubtitle: {
    color: '#DBEAFE',
    fontSize: 15,
  },

  societyDivider: {
    height: 1,
    backgroundColor: '#60A5FA',
    marginVertical: 16,
  },

  societyInfo: {
    color: '#EFF6FF',
    fontSize: 14,
    lineHeight: 21,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  statCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  statIcon: {
    fontSize: 25,
    marginBottom: 6,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },

  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  icon: {
    fontSize: 28,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 5,
  },

  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  viewText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },

  updateCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  updateIcon: {
    fontSize: 24,
    marginRight: 14,
  },

  updateContent: {
    flex: 1,
  },

  updateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 5,
  },

  updateText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },

  updateDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
    fontWeight: '600',
  },

  emptyUpdateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },

  emptyUpdateIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  emptyUpdateText: {
    fontSize: 14,
    color: '#64748B',
  },

  logoutButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },

  bottomSpace: {
    height: 40,
  },
});