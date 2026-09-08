import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

export default function ComplaintsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaints</Text>

      <Text style={styles.subtitle}>
        Report an issue in your society
      </Text>

      <Text style={styles.label}>Complaint</Text>

      <TextInput
        style={styles.input}
        placeholder="Describe your complaint"
        placeholderTextColor="#94A3B8"
        multiline
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Submit Complaint</Text>
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

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    height: 150,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
  },

  button: {
    height: 52,
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
});