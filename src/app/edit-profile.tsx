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

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getData,
  saveData,
} from '../data/storage';

type AccountData = {
  name: string;
  email: string;
  flat: string;
  password: string;
  role?: 'resident' | 'admin';
};

type ProfileData = {
  name: string;
  email: string;
  flat: string;
};

type Complaint = {
  id: string;
  email: string;
  text: string;
  date: string;
  status:
    | 'Submitted'
    | 'In Progress'
    | 'Resolved';
};

const ACCOUNT_KEY = 'accountData';
const PROFILE_KEY = 'profileData';

const BOOKING_PREFIX =
  'facilityBookings_';

const REGISTERED_EVENTS_PREFIX =
  'registeredEvents_';

const VOTED_POLLS_PREFIX =
  'votedPolls_';

const SELECTED_POLL_OPTIONS_PREFIX =
  'selectedPollOptions_';

const COMPLAINTS_KEY =
  'complaints';

const defaultProfile: ProfileData = {
  name: 'Karthikeyan',
  email: 'resident@example.com',
  flat: '2644',
};

export default function EditProfileScreen() {
  const [name, setName] = useState(
    defaultProfile.name
  );

  const [email, setEmail] = useState(
    defaultProfile.email
  );

  const [flat, setFlat] = useState(
    defaultProfile.flat
  );

  const [originalEmail, setOriginalEmail] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ========================================
  // LOAD CURRENT PROFILE
  // ========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile =
          await getData<ProfileData>(
            PROFILE_KEY
          );

        if (savedProfile) {
          setName(savedProfile.name);
          setEmail(savedProfile.email);
          setFlat(savedProfile.flat);

          setOriginalEmail(
            savedProfile.email
              .trim()
              .toLowerCase()
          );
        }
      } catch (error) {
        console.log(
          'Error loading profile:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ========================================
  // MOVE USER-SPECIFIC STORAGE
  // ========================================

  const moveUserData = async (
    oldEmail: string,
    newEmail: string
  ) => {
    if (oldEmail === newEmail) {
      return;
    }

    // ----------------------------------------
    // BOOKINGS
    // ----------------------------------------

    const oldBookingKey =
      `${BOOKING_PREFIX}${oldEmail}`;

    const newBookingKey =
      `${BOOKING_PREFIX}${newEmail}`;

    const oldBookings =
      await getData<any[]>(
        oldBookingKey
      );

    if (oldBookings) {
      await saveData(
        newBookingKey,
        oldBookings
      );

      await AsyncStorage.removeItem(
        oldBookingKey
      );
    }

    // ----------------------------------------
    // EVENT REGISTRATIONS
    // ----------------------------------------

    const oldEventsKey =
      `${REGISTERED_EVENTS_PREFIX}${oldEmail}`;

    const newEventsKey =
      `${REGISTERED_EVENTS_PREFIX}${newEmail}`;

    const oldRegisteredEvents =
      await getData<any[]>(
        oldEventsKey
      );

    if (oldRegisteredEvents) {
      await saveData(
        newEventsKey,
        oldRegisteredEvents
      );

      await AsyncStorage.removeItem(
        oldEventsKey
      );
    }

    // ----------------------------------------
    // POLL VOTING STATUS
    // ----------------------------------------

    const oldVotedPollsKey =
      `${VOTED_POLLS_PREFIX}${oldEmail}`;

    const newVotedPollsKey =
      `${VOTED_POLLS_PREFIX}${newEmail}`;

    const oldVotedPolls =
      await getData<any[]>(
        oldVotedPollsKey
      );

    if (oldVotedPolls) {
      await saveData(
        newVotedPollsKey,
        oldVotedPolls
      );

      await AsyncStorage.removeItem(
        oldVotedPollsKey
      );
    }

    // ----------------------------------------
    // SELECTED POLL OPTIONS
    // ----------------------------------------

    const oldSelectedOptionsKey =
      `${SELECTED_POLL_OPTIONS_PREFIX}${oldEmail}`;

    const newSelectedOptionsKey =
      `${SELECTED_POLL_OPTIONS_PREFIX}${newEmail}`;

    const oldSelectedOptions =
      await getData<any>(
        oldSelectedOptionsKey
      );

    if (oldSelectedOptions) {
      await saveData(
        newSelectedOptionsKey,
        oldSelectedOptions
      );

      await AsyncStorage.removeItem(
        oldSelectedOptionsKey
      );
    }

    // ----------------------------------------
    // COMPLAINTS
    // ----------------------------------------

    const complaints =
      await getData<Complaint[]>(
        COMPLAINTS_KEY
      );

    if (complaints) {
      const updatedComplaints =
        complaints.map(
          (complaint) => {
            if (
              complaint.email
                ?.trim()
                .toLowerCase() ===
              oldEmail
            ) {
              return {
                ...complaint,
                email: newEmail,
              };
            }

            return complaint;
          }
        );

      await saveData(
        COMPLAINTS_KEY,
        updatedComplaints
      );
    }
  };

  // ========================================
  // SAVE PROFILE
  // ========================================

  const saveProfile = async () => {
    if (loading || saving) {
      return;
    }

    // ----------------------------------------
    // VALIDATE FIELDS
    // ----------------------------------------

    if (
      !name.trim() ||
      !email.trim() ||
      !flat.trim()
    ) {
      Alert.alert(
        'Missing Details',
        'Please fill in all profile details.'
      );

      return;
    }

    // ----------------------------------------
    // VALIDATE EMAIL
    // ----------------------------------------

    const newEmail =
      email.trim().toLowerCase();

    if (
      !newEmail.includes('@') ||
      !newEmail.includes('.')
    ) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );

      return;
    }

    // ----------------------------------------
    // CURRENT EMAIL
    // ----------------------------------------

    const currentEmail =
      originalEmail ||
      newEmail;

    try {
      setSaving(true);

      // ======================================
      // GET ALL ACCOUNTS
      // ======================================

      const storedData =
        await getData<
          AccountData | AccountData[]
        >(ACCOUNT_KEY);

      let accounts: AccountData[] = [];

      // Support old format and new format
      if (Array.isArray(storedData)) {
        accounts = storedData;
      } else if (storedData) {
        accounts = [storedData];
      }

      // ======================================
      // FIND CURRENT ACCOUNT
      // ======================================

      const currentAccountIndex =
        accounts.findIndex(
          (account) =>
            account.email
              .trim()
              .toLowerCase() ===
            currentEmail
        );

      // ======================================
      // CURRENT ACCOUNT NOT FOUND
      // ======================================

      if (currentAccountIndex === -1) {
        Alert.alert(
          'Account Error',
          'Your account could not be found. Please logout and login again.'
        );

        return;
      }

      // ======================================
      // CHECK EMAIL DUPLICATE
      // ======================================

      const duplicateAccount =
        accounts.find(
          (account, index) =>
            index !==
              currentAccountIndex &&
            account.email
              .trim()
              .toLowerCase() ===
              newEmail
        );

      if (duplicateAccount) {
        Alert.alert(
          'Email Already Used',
          'Another account is already using this email address. Please use a different email.'
        );

        return;
      }

      // ======================================
      // CREATE UPDATED ACCOUNT
      // ======================================

      const currentAccount =
        accounts[currentAccountIndex];

      const updatedAccount: AccountData = {
        ...currentAccount,
        name: name.trim(),
        email: newEmail,
        flat: flat.trim().toUpperCase(),
      };

      // ======================================
      // UPDATE ONLY CURRENT ACCOUNT
      // ======================================

      const updatedAccounts =
        [...accounts];

      updatedAccounts[
        currentAccountIndex
      ] = updatedAccount;

      // ======================================
      // SAVE ACCOUNTS
      // ======================================

      await saveData(
        ACCOUNT_KEY,
        updatedAccounts
      );

      // ======================================
      // UPDATE PROFILE
      // ======================================

      const updatedProfile: ProfileData = {
        name: updatedAccount.name,
        email: updatedAccount.email,
        flat: updatedAccount.flat,
      };

      await saveData(
        PROFILE_KEY,
        updatedProfile
      );

      // ======================================
      // MOVE USER DATA IF EMAIL CHANGED
      // ======================================

      if (
        currentEmail !== newEmail
      ) {
        await moveUserData(
          currentEmail,
          newEmail
        );
      }

      // ======================================
      // UPDATE ORIGINAL EMAIL
      // ======================================

      setOriginalEmail(newEmail);

      // ======================================
      // SUCCESS
      // ======================================

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
        [
          {
            text: 'OK',

            onPress: () => {
              // Return to existing Profile screen
              router.back();
            },
          },
        ]
      );

    } catch (error) {
      console.log(
        'Error saving profile:',
        error
      );

      Alert.alert(
        'Error',
        'Unable to update your profile. Please try again.'
      );

    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>
        Edit Profile
      </Text>

      <Text style={styles.subtitle}>
        Update your account details
      </Text>

      <View style={styles.form}>

        {/* FULL NAME */}

        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor="#94A3B8"
          editable={
            !loading && !saving
          }
          autoCapitalize="words"
        />

        {/* EMAIL */}

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
          autoCorrect={false}
          editable={
            !loading && !saving
          }
        />

        {/* FLAT NUMBER */}

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
          editable={
            !loading && !saving
          }
        />

        {/* SAVE BUTTON */}

        <Pressable
          style={[
            styles.saveButton,
            (loading || saving) &&
              styles.disabledButton,
          ]}
          onPress={saveProfile}
          disabled={
            loading || saving
          }
        >
          <Text style={styles.saveText}>
            {loading
              ? 'Loading...'
              : saving
              ? 'Saving...'
              : 'Save Changes'}
          </Text>
        </Pressable>

        {/* BACK BUTTON */}

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </Pressable>

      </View>

    </ScrollView>
  );
}

// ========================================
// STYLES
// ========================================

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