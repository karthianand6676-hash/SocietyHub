import { StyleSheet, Text, View } from 'react-native';

export default function AnnouncementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Announcements</Text>

      <Text style={styles.subtitle}>
        Society announcements and important updates
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Society Meeting</Text>

        <Text style={styles.cardText}>
          Monthly society meeting will be held this Sunday.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Water Maintenance</Text>

        <Text style={styles.cardText}>
          Water maintenance work is scheduled tomorrow.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});