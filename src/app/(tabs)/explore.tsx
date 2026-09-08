import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Explore</Text>

      <Text style={styles.subtitle}>
        Discover everything in your society
      </Text>

      <View style={styles.grid}>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/announcment')}
        >
          <Text style={styles.icon}>📢</Text>
          <Text style={styles.cardTitle}>Announcements</Text>
          <Text style={styles.cardSubtitle}>
            Society updates
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/complaints')}
        >
          <Text style={styles.icon}>📝</Text>
          <Text style={styles.cardTitle}>Complaints</Text>
          <Text style={styles.cardSubtitle}>
            Report an issue
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/events')}
        >
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.cardTitle}>Events</Text>
          <Text style={styles.cardSubtitle}>
            Upcoming events
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/facilities')}
        >
          <Text style={styles.icon}>🏢</Text>
          <Text style={styles.cardTitle}>Facilities</Text>
          <Text style={styles.cardSubtitle}>
            Book facilities
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/polls')}
        >
          <Text style={styles.icon}>🗳️</Text>
          <Text style={styles.cardTitle}>Polls</Text>
          <Text style={styles.cardSubtitle}>
            Give your opinion
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.cardTitle}>My Profile</Text>
          <Text style={styles.cardSubtitle}>
            Account details
          </Text>
        </Pressable>

      </View>

    </ScrollView>
  );
}

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

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    minHeight: 190,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  icon: {
    fontSize: 40,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});