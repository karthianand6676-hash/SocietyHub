import { Stack, router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { getData } from '../data/storage';

const LOGIN_KEY = 'isLoggedIn';

export default function RootLayout() {
  const pathname = usePathname();
  const [checkingSession, setCheckingSession] =
    useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn =
        await getData<boolean>(LOGIN_KEY);

      const isAuthScreen =
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/welcome';

      const isInsideApp =
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

      if (loggedIn && isAuthScreen) {
        router.replace('/(tabs)/home');
      }

      if (!loggedIn && isInsideApp) {
        router.replace('/login');
      }

      setCheckingSession(false);
    };

    checkLogin();
  }, [pathname]);

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
    </Stack>
  );
}