import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getData, saveData } from '../data/storage';

type ProfileData = {
  name: string;
  email: string;
  flat: string;
};

const PROFILE_KEY = 'profileData';

const defaultProfile: ProfileData = {
  name: 'Karthikeyan',
  email: 'resident@example.com',
  flat: '2644',
};

export default function EditProfileScreen() {
  const [name, setName] = useState(
    defaultProfile.name,
  );

  const [email, setEmail] = useState(
    defaultProfile.email,
  );

  const [flat, setFlat] = useState(
    defaultProfile.flat,
  );

  const [loading, setLoading] = useState(true);

  // Load saved profile
  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile =
        await getData<ProfileData>(PROFILE_KEY);

      if (savedProfile) {
        setName(savedProfile.name);
        setEmail(savedProfile.email);
        setFlat(savedProfile.flat);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (loading) {
      return;
    }

    if (
      !name.trim() ||
      !email.trim() ||
      !flat.trim()
    ) {
      Alert.alert(
        'Missing Details',
        'Please fill in all profile details.',
      );
      return;
    }

    const updatedProfile: ProfileData = {
      name: name.trim(),
      email: email.trim(),
      flat: flat.trim(),
    };

    // Save permanently
    await saveData(
      PROFILE_KEY,
      updatedProfile,
    );

    Alert.alert(
      'Profile Updated',
      'Your profile has been updated successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/profile');
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        Edit Profile
      </Text>

      <Text style={styles.subtitle}>
        Update your account details
      </Text>

      <View style={styles.form}>

        {/* Full Name */}
        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor="#94A3B8"
          editable={!loading}
        />

        {/* Email */}
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        {/* Flat Number */}
        <Text style={styles.label}>
          Flat Number
        </Text>

        <TextInput
          style={styles.input}
          value={flat}
          onChangeText={setFlat}
          placeholder="Example: A-203"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          editable={!loading}
        />

        {/* Save */}
        <Pressable
          style={[
            styles.saveButton,
            loading && styles.disabledButton,
          ]}
          onPress={saveProfile}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            Save Changes
          </Text>
        </Pressable>

        {/* Back */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ← Back
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
    color: '#0F172A',
  },

  saveButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
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