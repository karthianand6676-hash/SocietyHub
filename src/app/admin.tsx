import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getData, removeData } from '../data/storage';

const ROLE_KEY = 'userRole';
const LOGIN_KEY = 'isLoggedIn';

export default function AdminScreen() {
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const loggedIn = await getData<boolean>(LOGIN_KEY);
      const role = await getData<string>(ROLE_KEY);

      if (!loggedIn || role !== 'admin') {
        Alert.alert(
          'Access Denied',
          'Only administrators can access this dashboard.',
          [
            {
              text: 'Go to Home',
              onPress: () =>
                router.replace('/(tabs)/home'),
            },
          ],
        );

        return;
      }

      setCheckingAccess(false);
    };

    checkAdminAccess();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await removeData(LOGIN_KEY);
            await removeData(ROLE_KEY);

            router.replace('/login');
          },
        },
      ],
    );
  };

  const openScreen = (route: string) => {
    router.push(route as any);
  };

  if (checkingAccess) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Checking admin access...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.smallTitle}>
              SocietyHub
            </Text>

            <Text style={styles.title}>
              Admin Dashboard
            </Text>

            <Text style={styles.subtitle}>
              Manage your society from one place.
            </Text>
          </View>

          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>
              ADMIN
            </Text>
          </View>
        </View>

        {/* Welcome Card */}

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeIcon}>
            🛡️
          </Text>

          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Welcome, Administrator
            </Text>

            <Text style={styles.welcomeText}>
              Manage announcements, complaints,
              events, facilities and polls.
            </Text>
          </View>
        </View>

        {/* Management */}

        <Text style={styles.sectionTitle}>
          Management
        </Text>

        {/* Announcements */}

        <Pressable
          style={styles.managementCard}
          onPress={() =>
            openScreen('/admin-announcment')
          }
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>
              📢
            </Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Announcements
            </Text>

            <Text style={styles.cardDescription}>
              Create and manage society announcements.
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        {/* Complaints */}

        <Pressable
          style={styles.managementCard}
          onPress={() =>
            openScreen('/complaints')
          }
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>
              📝
            </Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Complaints
            </Text>

            <Text style={styles.cardDescription}>
              Review resident complaints and their status.
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        {/* Events */}

        <Pressable
          style={styles.managementCard}
          onPress={() =>
            openScreen('/admin-events')
          }
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>
              📅
            </Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Events
            </Text>

            <Text style={styles.cardDescription}>
              View and manage community events.
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        {/* Facilities */}

        <Pressable
          style={styles.managementCard}
          onPress={() =>
            openScreen('/admin-facilities')
          }
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>
              🏢
            </Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Facilities & Bookings
            </Text>

            <Text style={styles.cardDescription}>
              Manage society facilities and bookings.
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        {/* Polls */}

        <Pressable
          style={styles.managementCard}
          onPress={() =>
            openScreen('/admin-poll')
          }
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>
              📊
            </Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Polls
            </Text>

            <Text style={styles.cardDescription}>
              View and manage community polls.
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        {/* Administration */}

        <Text style={styles.sectionTitle}>
          Administration
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            🛡️ Administrator Access
          </Text>

          <Text style={styles.infoText}>
            You are logged in with administrator
            privileges. Use the management sections
            above to handle society activities.
          </Text>
        </View>

        {/* Logout */}

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutIcon}>
            🚪
          </Text>

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContent: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  smallTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
  },

  adminBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  adminBadgeText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '800',
  },

  welcomeCard: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  welcomeIcon: {
    fontSize: 34,
    marginRight: 14,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },

  welcomeText: {
    color: '#DBEAFE',
    fontSize: 13,
    lineHeight: 19,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },

  managementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  icon: {
    fontSize: 24,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },

  arrow: {
    fontSize: 28,
    color: '#94A3B8',
    marginLeft: 8,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  infoText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },

  logoutButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },

  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
});