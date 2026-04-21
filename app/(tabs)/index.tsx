
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, StatusBar, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../utils/supabase';
import { useSubscriptionStore, Subscription } from '../../store/useSubscriptionStore';
import Colors from '../../constants/Colors';
import Dashboard from '../../components/Dashboard';
import SubscriptionItem from '../../components/SubscriptionItem';
import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import Paywall from '../../components/Paywall';

import { useTheme } from '../../hooks/useTheme';

export default function TabOneScreen() {
  const router = useRouter();
  const { subscriptions, getActiveTotal, getTrialRisk, getNextMonthForecast, isPremium, upgradeToPremium, downgradeToFree } = useSubscriptionStore();
  const { 
    isLightBg, 
    currentPrimary, 
    currentSecondary, 
    currentBg, 
    currentFont, 
    textColor, 
    subTextColor, 
    cardBg, 
    inputBg,
    theme 
  } = useTheme();

  const [showPaywall, setShowPaywall] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const activeTotal = getActiveTotal();
  const trialRisk = getTrialRisk();
  const forecast = getNextMonthForecast();

  // Computed values with Search Filter
  const activeSubs = subscriptions.filter(s =>
    s.type === 'active' && s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const trialSubs = subscriptions.filter(s =>
    s.type === 'trial' && s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.enabled ? theme.backgroundColor : Colors.dark.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isLightBg ? "dark-content" : "light-content"} />

      <Paywall
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPurchase={() => {
          upgradeToPremium();
          setShowPaywall(false);
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: theme.enabled ? theme.backgroundColor : Colors.dark.background }]}>
          <Pressable onPress={async () => {
            if (isPremium) {
              const success = await downgradeToFree();
              if (success) alert("Demo: Switched to Free Plan");
            } else {
              setShowPaywall(true);
            }
          }}>
            <Text style={[styles.headerTitle, { fontFamily: currentFont, color: textColor }]}>
              My Subscriptions {isPremium && <Text style={{ color: Colors.dark.warning, fontSize: 24 }}>👑</Text>}
            </Text>
          </Pressable>
        </View>

        <Dashboard
          activeTotal={activeTotal}
          activeCount={activeSubs.length}
          trialRisk={trialRisk}
          trialCount={trialSubs.length}
          forecast={forecast}
        />

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: inputBg, borderColor: isLightBg ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }]}>
          <Ionicons name="search" size={20} color={subTextColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search subscriptions..."
            placeholderTextColor={subTextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={subTextColor} />
            </Pressable>
          )}
        </View>

        {subscriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No subscriptions yet.</Text>
            <Text style={styles.emptySubtext}>Tap '+' to add one.</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {/* Trials First (Urgent) */}
            {trialSubs.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: currentSecondary, fontFamily: currentFont }]}>Free Trials (Action Needed)</Text>
                {trialSubs.map(sub => (
                  <SubscriptionItem
                    key={sub.id}
                    subscription={sub}
                    onPress={() => router.push(`/subscription/${sub.id}`)}
                  />
                ))}
              </View>
            )}

            {/* Active Subs */}
            {activeSubs.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: currentSecondary, fontFamily: currentFont }]}>Active Subscriptions</Text>
                {activeSubs.map(sub => (
                  <SubscriptionItem
                    key={sub.id}
                    subscription={sub}
                    onPress={() => router.push(`/subscription/${sub.id}`)}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Demo Controls (Absolute Bottom for easy access during testing) */}
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#333', backgroundColor: '#000' }}>
        <Text style={{ color: '#666', fontSize: 10, marginBottom: 8, textTransform: 'uppercase' }}>Demo Controls</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={() => {
              downgradeToFree();
              alert("Switched to Free Plan");
            }}
            style={{ flex: 1, padding: 10, backgroundColor: '#333', borderRadius: 8, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>Reset to Free</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              upgradeToPremium();
              alert("Switched to Premium");
            }}
            style={{ flex: 1, padding: 10, backgroundColor: Colors.dark.primary, borderRadius: 8, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>Force Premium</Text>
          </Pressable>
        </View>
      </View>

      {/* FAB handled by tabs or absolute button? Tabs usually have bottom nav. */}
      {/* We rely on the Tab Bar "Add" button usually, but user might want a floating button. 
          For now, Expo Router Tabs typicaly puts navigation at bottom. */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signOutBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    opacity: 0.8,
  },
  listContainer: {
    gap: 10
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    opacity: 0.5,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: '#fff',
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 0,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});
