import { Stack, router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { getData } from '../data/storage';

const LOGIN_KEY = 'isLoggedIn';
const ROLE_KEY = 'userRole';

export default function RootLayout() {
  const pathname = usePathname();

  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const loggedIn = await getData<boolean>(LOGIN_KEY);
      const role = await getData<string>(ROLE_KEY);

      // -----------------------------
      // Authentication screens
      // -----------------------------
      const isAuthScreen =
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/welcome';

      // -----------------------------
      // Resident screens
      // -----------------------------
      const isResidentScreen =
        pathname.startsWith('/(tabs)') ||
        pathname === '/home' ||
        pathname === '/complaints' ||
        pathname === '/events' ||
        pathname === '/facilities' ||
        pathname === '/polls' ||
        pathname === '/profile' ||
        pathname === '/booking' ||
        pathname === '/edit-profile' ||
        pathname === '/announcement';

      // -----------------------------
      // Admin screens
      // -----------------------------
      const isAdminScreen =
        pathname === '/admin' ||
        pathname === '/admin-announcement' ||
        pathname === '/admin-events' ||
        pathname === '/admin-facilities' ||
        pathname === '/admin-polls';

      // -----------------------------
      // Logged-in user trying auth page
      // -----------------------------
      if (loggedIn && isAuthScreen) {
        if (role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/(tabs)/home');
        }

        return;
      }

      // -----------------------------
      // Logged-out user trying app
      // -----------------------------
      if (!loggedIn && (isResidentScreen || isAdminScreen)) {
        router.replace('/login');
        return;
      }

      // -----------------------------
      // Resident trying admin page
      // -----------------------------
      if (
        loggedIn &&
        role !== 'admin' &&
        isAdminScreen
      ) {
        router.replace('/(tabs)/home');
        return;
      }

      setCheckingSession(false);
    };

    checkAccess();
  }, [pathname]);

  if (checkingSession) {
    return null;
  }

  return (
    <Stack
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="admin" />
      <Stack.Screen name="admin-announcment" />
      <Stack.Screen name="admin-events" />
      <Stack.Screen name="admin-facilities" />
      <Stack.Screen name="admin-poll" />
    </Stack>
  );
}