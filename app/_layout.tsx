import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { View, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { StripeAppWrapper } from '../components/StripeAppWrapper';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const { setSession: setStoreSession } = useSubscriptionStore();

  useEffect(() => {
    // 1. Initialize Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setStoreSession(session);
      setInitialized(true);
    });

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setStoreSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isLandingPage = (segments.length as number) === 0;

    if (session && (inAuthGroup || isLandingPage)) {
      // If user is signed in, redirect away from Auth and Landing Page to Dashboard
      router.replace('/(tabs)');
    } else if (!session && inTabsGroup) {
      // If user is NOT signed in, redirect away from Dashboard to Auth
      router.replace('/(auth)');
    }
  }, [session, initialized, segments]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.dark.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <StripeAppWrapper>
        <Slot />
        <StatusBar style="light" />
      </StripeAppWrapper>
    </ErrorBoundary>
  );
}
