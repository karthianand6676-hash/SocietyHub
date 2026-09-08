import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function FacilitiesScreen() {
  return (
    <ScrollView style={styles.container}>
      
      <Text style={styles.title}>Facilities</Text>

      <Text style={styles.subtitle}>
        Book and use society facilities
      </Text>

      <View style={styles.card}>
        <Text style={styles.icon}>🏢</Text>
        <Text style={styles.cardTitle}>Community Hall</Text>
        <Text style={styles.cardSubtitle}>
          Available for meetings and functions
        </Text>
        <Pressable style={styles.button}onPress={() =>router.push({pathname: '/booking',params: { facility: 'Community Hall' }, })}>
          <Text style={styles.buttonText}>Book Now</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.icon}>🏊</Text>
        <Text style={styles.cardTitle}>Swimming Pool</Text>
        <Text style={styles.cardSubtitle}>
          Enjoy the society swimming pool
        </Text>

        <Pressable style={styles.button} onPress={() =>router.push({
      pathname: '/booking',
      params: { facility: 'Swimming Pool' },})}>
            <Text style={styles.buttonText}>Book Now</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.icon}>🏋️</Text>
        <Text style={styles.cardTitle}>Gym</Text>
        <Text style={styles.cardSubtitle}>
          Fitness facility for residents
        </Text>

        <Pressable
        style={styles.button}
        onPress={() =>
            router.push({
            pathname: '/booking',
            params: { facility: 'Gym' },
            })}>
            <Text style={styles.buttonText}>Book Now</Text>
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
    marginBottom: 8,
  },

  cardSubtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 20,
  },

  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
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