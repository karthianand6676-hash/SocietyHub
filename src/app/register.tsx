import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
} from 'react-native';

import { Link, router } from 'expo-router';
import { useState } from 'react';
import { getData, saveData } from '../data/storage';

type AccountData = {
  name: string;
  email: string;
  flat: string;
  password: string;
  role: 'resident' | 'admin';
};

type ProfileData = {
  name: string;
  email: string;
  flat: string;
};

const ACCOUNT_KEY = 'accountData';
const PROFILE_KEY = 'profileData';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [flat, setFlat] = useState('');
  const [password, setPassword] = useState('');

  const createAccount = async () => {
    // Check empty fields
    if (
      !name.trim() ||
      !email.trim() ||
      !flat.trim() ||
      !password.trim()
    ) {
      Alert.alert(
        'Missing Details',
        'Please fill in all the fields.',
      );
      return;
    }

    // Basic email validation
    if (!email.includes('@')) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.',
      );
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least 6 characters.',
      );
      return;
    }

    // Check whether an account already exists
    const existingAccount =
      await getData<AccountData>(ACCOUNT_KEY);

    if (
      existingAccount &&
      existingAccount.email.toLowerCase() ===
        email.trim().toLowerCase()
    ) {
      Alert.alert(
        'Account Already Exists',
        'An account with this email already exists. Please login.',
      );
      return;
    }

    // Create resident account
    const account: AccountData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      flat: flat.trim().toUpperCase(),
      password,
      role: 'resident',
    };

    const profile: ProfileData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      flat: flat.trim().toUpperCase(),
    };

    // Save account
    await saveData(ACCOUNT_KEY, account);

    // Save profile
    await saveData(PROFILE_KEY, profile);

    Alert.alert(
      'Account Created',
      'Your SocietyHub account has been created successfully.',
      [
        {
          text: 'Go to Login',
          onPress: () => router.replace('/login'),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SocietyHub</Text>

      <Text style={styles.title}>
        Create Account
      </Text>

      <Text style={styles.subtitle}>
        Join your community and stay connected.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>
          Flat Number
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: A-203"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          value={flat}
          onChangeText={setFlat}
        />

        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={styles.button}
          onPress={createAccount}
        >
          <Text style={styles.buttonText}>
            Create Account
          </Text>
        </Pressable>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Already have an account?{' '}
        </Text>

        <Link
          href="/login"
          style={styles.loginLink}
        >
          Login
        </Link>
      </View>

      <Pressable
        style={styles.backButton}
        onPress={() => router.replace('/welcome')}
      >
        <Text style={styles.backText}>
          ← Back
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    justifyContent: 'center',
  },

  logo: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#334155',
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    color: '#0F172A',
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

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  loginText: {
    color: '#64748B',
    fontSize: 14,
  },

  loginLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 20,
  },

  backText: {
    color: '#64748B',
    fontSize: 14,
  },
});