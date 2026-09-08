import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.name}>Karthikeyan</Text>
          <Text style={styles.flat}>Flat 2644</Text>
        </View>

        <Pressable
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.profileText}>👤</Text>
        </Pressable>
      </View>

      {/* Society Card */}
      <View style={styles.societyCard}>
        <Text style={styles.societyTitle}>SocietyHub</Text>

        <Text style={styles.societySubtitle}>
          Your community, connected.
        </Text>

        <View style={styles.societyDivider} />

        <Text style={styles.societyInfo}>
          Stay updated with your society activities,
          announcements and services.
        </Text>
      </View>

      {/* Quick Stats */}
      <Text style={styles.sectionTitle}>Your Society</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📢</Text>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Updates</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📅</Text>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🏢</Text>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Facilities</Text>
        </View>
      </View>

      {/* Quick Access */}
      <Text style={styles.sectionTitle}>Quick Access</Text>

      <View style={styles.grid}>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/announcment')}
        >
          <Text style={styles.icon}>📢</Text>

          <Text style={styles.cardTitle}>
            Announcements
          </Text>

          <Text style={styles.cardSubtitle}>
            Society updates
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/complaints')}
        >
          <Text style={styles.icon}>📝</Text>

          <Text style={styles.cardTitle}>
            Complaints
          </Text>

          <Text style={styles.cardSubtitle}>
            Report an issue
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/events')}
        >
          <Text style={styles.icon}>📅</Text>

          <Text style={styles.cardTitle}>
            Events
          </Text>

          <Text style={styles.cardSubtitle}>
            Upcoming events
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/facilities')}
        >
          <Text style={styles.icon}>🏢</Text>

          <Text style={styles.cardTitle}>
            Facilities
          </Text>

          <Text style={styles.cardSubtitle}>
            Book facilities
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/polls')}
        >
          <Text style={styles.icon}>🗳️</Text>

          <Text style={styles.cardTitle}>
            Polls
          </Text>

          <Text style={styles.cardSubtitle}>
            Give your opinion
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.icon}>👤</Text>

          <Text style={styles.cardTitle}>
            My Profile
          </Text>

          <Text style={styles.cardSubtitle}>
            Account details
          </Text>
        </Pressable>

      </View>

      {/* Recent Updates */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Recent Updates
        </Text>

        <Pressable
          onPress={() => router.push('/announcment')}
        >
          <Text style={styles.viewText}>View All</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.updateCard}
        onPress={() => router.push('/announcment')}
      >
        <Text style={styles.updateIcon}>📢</Text>

        <View style={styles.updateContent}>
          <Text style={styles.updateTitle}>
            Society Meeting
          </Text>

          <Text style={styles.updateText}>
            Monthly society meeting will be held this Sunday.
          </Text>

          <Text style={styles.updateDate}>
            08 Sept 2026
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.updateCard}
        onPress={() => router.push('/announcment')}
      >
        <Text style={styles.updateIcon}>🔧</Text>

        <View style={styles.updateContent}>
          <Text style={styles.updateTitle}>
            Water Maintenance
          </Text>

          <Text style={styles.updateText}>
            Water maintenance work is scheduled tomorrow.
          </Text>

          <Text style={styles.updateDate}>
            07 Sept 2026
          </Text>
        </View>
      </Pressable>

      <View style={styles.bottomSpace} />

    </ScrollView>
  );
}

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

  bottomSpace: {
    height: 40,
  },
});