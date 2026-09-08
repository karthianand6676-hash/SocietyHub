import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>

      <Text style={styles.subtitle}>
        Upcoming society events
      </Text>

      <View style={styles.card}>
        <Text style={styles.date}>📅 July 17</Text>

        <Text style={styles.cardTitle}>
          Society Meeting
        </Text>

        <Text style={styles.cardText}>
          Monthly society meeting will be held this Sunday.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.date}>🎉 July 20</Text>

        <Text style={styles.cardTitle}>
          Community Gathering
        </Text>

        <Text style={styles.cardText}>
          Join your neighbours for a community gathering.
        </Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>View All Events</Text>
      </Pressable>
    </View>
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
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  date: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 21,
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});