import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getData, removeData } from '../data/storage';

type ProfileData = {
  name: string;
  email: string;
  flat: string;
};

const PROFILE_KEY = 'profileData';
const LOGIN_KEY = 'isLoggedIn';

const defaultProfile: ProfileData = {
  name: 'Resident',
  email: 'resident@example.com',
  flat: 'A-203',
};

export default function ProfileScreen() {
  const [profile, setProfile] =
    useState<ProfileData>(defaultProfile);

  // Load saved profile
  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile =
        await getData<ProfileData>(PROFILE_KEY);

      if (savedProfile) {
        setProfile(savedProfile);
      }
    };

    loadProfile();
  }, []);

  // Logout
  const handleLogout = async () => {
    await removeData(LOGIN_KEY);

    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <Text style={styles.subtitle}>
        Your account details
      </Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Text style={styles.avatar}>👤</Text>

        <Text style={styles.name}>
          {profile.name}
        </Text>

        <Text style={styles.role}>
          Society Resident
        </Text>
      </View>

      {/* Profile Information */}
      <View style={styles.infoCard}>
        <Text style={styles.label}>
          Full Name
        </Text>

        <Text style={styles.value}>
          {profile.name}
        </Text>

        <Text style={styles.label}>
          Email
        </Text>

        <Text style={styles.value}>
          {profile.email}
        </Text>

        <Text style={styles.label}>
          Flat Number
        </Text>

        <Text style={styles.value}>
          {profile.flat}
        </Text>
      </View>

      {/* Edit Profile */}
      <Pressable
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: '/edit-profile',
            params: {
              name: profile.name,
              email: profile.email,
              flat: profile.flat,
            },
          })
        }
      >
        <Text style={styles.buttonText}>
          Edit Profile
        </Text>
      </Pressable>

      {/* Logout */}
      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          Logout
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

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    fontSize: 65,
    marginBottom: 15,
  },

  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
  },

  role: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 6,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 5,
  },

  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 20,
  },

  editButton: {
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

  logoutButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  logoutText: {
    color: '#DC2626',
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