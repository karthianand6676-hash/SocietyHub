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
          <Text style={styles.name}>Resident</Text>
        </View>

        <Pressable style={styles.profileButton}>
          <Text style={styles.profileText}>👤</Text>
        </Pressable>
      </View>

      {/* Society Card */}
      <View style={styles.societyCard}>
        <Text style={styles.societyTitle}>SocietyHub</Text>
        <Text style={styles.societySubtitle}>
          Your community, connected.
        </Text>
      </View>

      {/* Section title */}
      <Text style={styles.sectionTitle}>Quick Access</Text>

      {/* Feature Cards */}
      <View style={styles.grid}>
          <Pressable style={styles.card}onPress={() => router.push('/announcment')}>
          <Text style={styles.icon}>📢</Text>
          <Text style={styles.cardTitle}>Announcements</Text>
          <Text style={styles.cardSubtitle}>
            Society updates
          </Text>
        </Pressable>

        <Pressable style={styles.card}onPress={() => router.push('/complaints')}>
          <Text style={styles.icon}>📝</Text>
          <Text style={styles.cardTitle}>Complaints</Text>
          <Text style={styles.cardSubtitle}>
            Report an issue
          </Text>
        </Pressable>

        <Pressable style={styles.card}onPress={() => router.push('/events')}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.cardTitle}>Events</Text>
          <Text style={styles.cardSubtitle}>
            Upcoming events
          </Text>
        </Pressable>

        <Pressable style={styles.card} onPress={() => router.push('/facilities')}>
          <Text style={styles.icon}>🏢</Text>
          <Text style={styles.cardTitle}>Facilities</Text>
          <Text style={styles.cardSubtitle}>
            Book facilities
          </Text>
        </Pressable>

        <Pressable style={styles.card} onPress={() => router.push('/polls')}>
          <Text style={styles.icon}>🗳️</Text>
          <Text style={styles.cardTitle}>Polls</Text>
          <Text style={styles.cardSubtitle}>
            Give your opinion
          </Text>
        </Pressable>

        <Pressable style={styles.card } onPress={() => router.push('/profile')}>
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.cardTitle}>My Profile</Text>
          <Text style={styles.cardSubtitle}>
            Account details
          </Text>
        </Pressable>

      </View>

      {/* Recent Updates */}
      <Text style={styles.sectionTitle}>Recent Updates</Text>

      <View style={styles.updateCard}>
        <Text style={styles.updateIcon}>📢</Text>

        <View style={styles.updateContent}>
          <Text style={styles.updateTitle}>
            Society meeting
          </Text>

          <Text style={styles.updateText}>
            Monthly society meeting will be held this Sunday.
          </Text>
        </View>
      </View>

      <View style={styles.updateCard}>
        <Text style={styles.updateIcon}>🔧</Text>

        <View style={styles.updateContent}>
          <Text style={styles.updateTitle}>
            Maintenance work
          </Text>

          <Text style={styles.updateText}>
            Water maintenance work is scheduled tomorrow.
          </Text>
        </View>
      </View>

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

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
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
});