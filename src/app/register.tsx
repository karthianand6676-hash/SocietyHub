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
import {
  getData,
  saveData,
} from '../data/storage';

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
    // ========================================
    // VALIDATE FIELDS
    // ========================================

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

    // ========================================
    // VALIDATE EMAIL
    // ========================================

    const newEmail =
      email.trim().toLowerCase();

    if (
      !newEmail.includes('@') ||
      !newEmail.includes('.')
    ) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.',
      );

      return;
    }

    // ========================================
    // VALIDATE PASSWORD
    // ========================================

    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least 6 characters.',
      );

      return;
    }

    try {
      // ========================================
      // GET EXISTING ACCOUNTS
      // ========================================

      const storedData =
        await getData<
          AccountData | AccountData[]
        >(ACCOUNT_KEY);

      let accounts: AccountData[] = [];

      /*
       * Support both:
       *
       * OLD FORMAT:
       * accountData = { ... }
       *
       * NEW FORMAT:
       * accountData = [ {...}, {...} ]
       */

      if (Array.isArray(storedData)) {
        accounts = storedData;
      } else if (storedData) {
        accounts = [storedData];
      }

      // ========================================
      // CHECK DUPLICATE EMAIL
      // ========================================

      const existingAccount =
        accounts.find(
          (account) =>
            account.email
              .trim()
              .toLowerCase() === newEmail
        );

      if (existingAccount) {
        Alert.alert(
          'Account Already Exists',
          'An account with this email already exists. Please login.',
        );

        return;
      }

      // ========================================
      // CREATE NEW ACCOUNT
      // ========================================

      const account: AccountData = {
        name: name.trim(),
        email: newEmail,
        flat: flat.trim().toUpperCase(),
        password,
        role: 'resident',
      };

      // Add new account without deleting
      // existing accounts.
      const updatedAccounts = [
        ...accounts,
        account,
      ];

      // ========================================
      // SAVE ALL ACCOUNTS
      // ========================================

      await saveData(
        ACCOUNT_KEY,
        updatedAccounts
      );

      // ========================================
      // SAVE PROFILE FOR NEW ACCOUNT
      // ========================================

      const profile: ProfileData = {
        name: account.name,
        email: account.email,
        flat: account.flat,
      };

      await saveData(
        PROFILE_KEY,
        profile
      );

      // ========================================
      // SUCCESS
      // ========================================

      Alert.alert(
        'Account Created',
        'Your SocietyHub account has been created successfully.',
        [
          {
            text: 'Go to Login',
            onPress: () =>
              router.replace('/login'),
          },
        ],
      );

      // Clear fields
      setName('');
      setEmail('');
      setFlat('');
      setPassword('');

    } catch (error) {
      console.log(
        'Registration error:',
        error
      );

      Alert.alert(
        'Registration Error',
        'Something went wrong while creating your account. Please try again.',
      );
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>
        SocietyHub
      </Text>

      <Text style={styles.title}>
        Create Account
      </Text>

      <Text style={styles.subtitle}>
        Join your community and stay connected.
      </Text>

      <View style={styles.form}>

        {/* FULL NAME */}

        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        {/* EMAIL */}

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        {/* FLAT */}

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

        {/* PASSWORD */}

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

        {/* CREATE ACCOUNT */}

        <Pressable
          style={styles.button}
          onPress={createAccount}
        >
          <Text style={styles.buttonText}>
            Create Account
          </Text>
        </Pressable>

      </View>

      {/* LOGIN */}

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

      {/* BACK */}

      <Pressable
        style={styles.backButton}
        onPress={() =>
          router.replace('/welcome')
        }
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