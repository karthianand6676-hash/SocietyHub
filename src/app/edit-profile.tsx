import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function EditProfileScreen() {
  const params = useLocalSearchParams();

  const [name, setName] = useState(
    typeof params.name === 'string' ? params.name : 'Resident'
  );

  const [email, setEmail] = useState(
    typeof params.email === 'string'
      ? params.email
      : 'resident@example.com'
  );

  const [flat, setFlat] = useState(
    typeof params.flat === 'string' ? params.flat : 'A-203'
  );

  const saveProfile = () => {
    router.replace({
      pathname: '/profile',
      params: {
        name,
        email,
        flat,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.subtitle}>
        Update your account details
      </Text>

      <View style={styles.form}>

        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Flat Number</Text>

        <TextInput
          style={styles.input}
          value={flat}
          onChangeText={setFlat}
          placeholder="Example: A-203"
          placeholderTextColor="#94A3B8"
        />

        <Pressable
          style={styles.saveButton}
          onPress={saveProfile}
        >
          <Text style={styles.saveText}>Save Changes</Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
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

  form: {
    width: '100%',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 22,
  },

  saveButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 40,
  },

  backText: {
    color: '#64748B',
    fontSize: 17,
  },
});