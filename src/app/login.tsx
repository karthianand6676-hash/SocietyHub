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
import { saveData } from '../data/storage';

const LOGIN_KEY = 'isLoggedIn';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Missing Details',
        'Please enter your email and password.',
      );
      return;
    }

    // Save login session
    await saveData(LOGIN_KEY, true);

    router.replace('/(tabs)/home');
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
        />

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
        />

        <Pressable
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            Login
          </Text>
        </Pressable>

      </View>

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