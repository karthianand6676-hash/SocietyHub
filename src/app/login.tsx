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
  role?: 'resident' | 'admin';
};

const ACCOUNT_KEY = 'accountData';
const LOGIN_KEY = 'isLoggedIn';
const ROLE_KEY = 'userRole';

const ADMIN_EMAIL = 'admin@societyhub.com';
const ADMIN_PASSWORD = 'admin123';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (loggingIn) {
      return;
    }

    // Check empty fields
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Missing Details',
        'Please enter your email and password.',
      );
      return;
    }

    setLoggingIn(true);

    const enteredEmail = email.trim().toLowerCase();

    // --------------------------------
    // ADMIN LOGIN
    // --------------------------------
    if (
      enteredEmail === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      await saveData(LOGIN_KEY, true);
      await saveData(ROLE_KEY, 'admin');

      setLoggingIn(false);

      Alert.alert(
        'Admin Login Successful',
        'Welcome to the SocietyHub Admin Dashboard!',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/admin'),
          },
        ],
      );

      return;
    }

    // --------------------------------
    // RESIDENT LOGIN
    // --------------------------------

    // Get registered resident account
    const account =
      await getData<AccountData>(ACCOUNT_KEY);

    // No account found
    if (!account) {
      setLoggingIn(false);

      Alert.alert(
        'Account Not Found',
        'No account has been registered yet. Please create an account first.',
      );

      return;
    }

    // Check email
    if (
      enteredEmail !==
      account.email.toLowerCase()
    ) {
      setLoggingIn(false);

      Alert.alert(
        'Login Failed',
        'The email address is incorrect.',
      );

      return;
    }

    // Check password
    if (password !== account.password) {
      setLoggingIn(false);

      Alert.alert(
        'Login Failed',
        'The password is incorrect.',
      );

      return;
    }

    // Existing accounts without a role
    // are treated as residents
    const role = account.role ?? 'resident';

    // Prevent any unexpected admin account
    // from entering the resident flow
    if (role === 'admin') {
      await saveData(LOGIN_KEY, true);
      await saveData(ROLE_KEY, 'admin');

      setLoggingIn(false);

      Alert.alert(
        'Admin Login Successful',
        `Welcome back, ${account.name}!`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/admin'),
          },
        ],
      );

      return;
    }

    // Resident login successful
    await saveData(LOGIN_KEY, true);
    await saveData(ROLE_KEY, 'resident');

    setLoggingIn(false);

    Alert.alert(
      'Login Successful',
      `Welcome back, ${account.name}!`,
      [
        {
          text: 'Continue',
          onPress: () =>
            router.replace('/(tabs)/home'),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>
        SocietyHub
      </Text>

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Login to manage your society and stay connected.
      </Text>

      <View style={styles.form}>

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
          editable={!loggingIn}
        />

        {/* Password */}
        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          editable={!loggingIn}
        />

        {/* Login */}
        <Pressable
          style={[
            styles.button,
            loggingIn && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={loggingIn}
        >
          <Text style={styles.buttonText}>
            {loggingIn
              ? 'Logging in...'
              : 'Login'}
          </Text>
        </Pressable>

      </View>

      {/* Register */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Don't have an account?{' '}
        </Text>

        <Link
          href="/register"
          style={styles.registerLink}
        >
          Register
        </Link>
      </View>

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
    marginBottom: 35,
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
    marginBottom: 35,
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
    height: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
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

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  registerText: {
    color: '#64748B',
    fontSize: 14,
  },

  registerLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
});     