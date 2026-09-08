import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function PollsScreen() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Polls</Text>

      <Text style={styles.subtitle}>
        Give your opinion on society matters
      </Text>

      <View style={styles.card}>
        <Text style={styles.icon}>🗳️</Text>

        <Text style={styles.cardTitle}>
          Parking Area Improvement
        </Text>

        <Text style={styles.question}>
          Should the society improve the parking area?
        </Text>

        <Pressable style={styles.option}>
          <Text style={styles.optionText}>Yes</Text>
        </Pressable>

        <Pressable style={styles.option}>
          <Text style={styles.optionText}>No</Text>
        </Pressable>

        <Pressable style={styles.voteButton}>
          <Text style={styles.voteText}>Submit Vote</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.icon}>📊</Text>

        <Text style={styles.cardTitle}>
          Security Improvement
        </Text>

        <Text style={styles.question}>
          Should additional security cameras be installed?
        </Text>

        <Pressable style={styles.option}>
          <Text style={styles.optionText}>Yes</Text>
        </Pressable>

        <Pressable style={styles.option}>
          <Text style={styles.optionText}>No</Text>
        </Pressable>

        <Pressable style={styles.voteButton}>
          <Text style={styles.voteText}>Submit Vote</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

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

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },

  icon: {
    fontSize: 45,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  question: {
    fontSize: 17,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 20,
  },

  option: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },

  optionText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
    textAlign: 'center',
  },

  voteButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  voteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 40,
  },

  backText: {
    color: '#64748B',
    fontSize: 17,
  },
});