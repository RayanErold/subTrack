import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { Alert } from 'react-native';
import { addDays, isAfter, isBefore, parseISO } from 'date-fns';
import { Category } from '../utils/smartCategories';

import { Subscription, SubscriptionType, BillingCycle } from '../types';

interface SubscriptionState {
  session: Session | null;
  isLoading: boolean;
  subscriptions: Subscription[];

  setSession: (session: Session | null) => void;

  fetchSubscriptions: () => Promise<void>;
  addSubscription: (sub: Omit<Subscription, 'id' | 'created_at'>) => Promise<void>;
  removeSubscription: (id: string) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;

  getActiveTotal: () => number;
  getTrialRisk: () => number;
  getNextMonthForecast: () => number;

  isPremium: boolean;
  setPremium: (status: boolean) => void;
  upgradeToPremium: (amount?: number, plan?: string) => Promise<boolean>;
  downgradeToFree: () => Promise<boolean>;
  checkPremiumStatus: () => Promise<void>;
  canAddSubscription: () => boolean;

  // Theme Settings
  theme: {
    enabled: boolean;
    font: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  setTheme: (theme: Partial<SubscriptionState['theme']>) => void;
  // Notification Settings
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  // General App Settings
  currency: string;
  setCurrency: (currency: string) => void;
  exportStoreData: () => string;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      session: null,
      isLoading: false,
      subscriptions: [],
      isPremium: false,

      setSession: (session) => {
        set({ session });
        if (session) {
          get().fetchSubscriptions();
        } else {
          set({ subscriptions: [] }); // Clear data on logout
        }
      },

      setPremium: (status) => set({ isPremium: status }),

      upgradeToPremium: async (amount: number = 49.99, plan: string = 'Lifetime') => {
        const { session } = get();
        if (!session) return false;

        try {
          const { logPayment } = await import('../utils/payment');
          await logPayment({
            user_id: session.user.id,
            amount,
            currency: get().currency,
            status: 'succeeded'
          });
          set({ isPremium: true });
          return true;
        } catch (error) {
          console.error('Upgrade failed:', error);
          return false;
        }
      },

      downgradeToFree: async () => {
        const { session } = get();
        if (!session) {
          set({ isPremium: false });
          return true;
        }

        try {
          const { deactivatePremium } = await import('../utils/payment');
          await deactivatePremium();
          set({ isPremium: false });
          return true;
        } catch (error) {
          console.error('Downgrade failed:', error);
          return false;
        }
      },

      theme: {
        enabled: true,
        font: 'System',
        primaryColor: '#6C63FF', // Default Indigo
        secondaryColor: '#FF6584', // Default Secondary
        backgroundColor: '#0a0a0a', // Default Black
      },

      setTheme: (newTheme: Partial<SubscriptionState['theme']>) => set((state) => ({
        theme: { ...state.theme, ...newTheme }
      })),

      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      currency: '$',
      setCurrency: (currency) => set({ currency }),

      exportStoreData: () => {
        const { subscriptions, isPremium, theme, notificationsEnabled, currency } = get();
        const exportData = {
          exportDate: new Date().toISOString(),
          appStatus: isPremium ? 'Premium' : 'Free',
          settings: {
            theme,
            notificationsEnabled,
            currency,
          },
          subscriptions: subscriptions.map(sub => ({
            name: sub.name,
            price: sub.price,
            billingCycle: sub.billingCycle,
            category: sub.category,
            renewalDate: sub.renewalDate,
            type: sub.type,
          }))
        };
        return JSON.stringify(exportData, null, 2);
      },

      canAddSubscription: () => {
        const { subscriptions, isPremium } = get();
        if (isPremium) return true;
        return subscriptions.length < 5;
      },

      checkPremiumStatus: async () => {
        const { session } = get();
        if (!session) return;

        // Check if user has a successful payment
        const { data, error } = await supabase
          .from('payments')
          .select('status')
          .eq('user_id', session.user.id)
          .eq('status', 'succeeded')
          .limit(1);

        if (data && data.length > 0) {
          set({ isPremium: true });
        } else {
          set({ isPremium: false });
        }
      },

      fetchSubscriptions: async () => {
        const { session, checkPremiumStatus } = get();
        if (!session) return;

        set({ isLoading: true });

        // Sync premium status
        await checkPremiumStatus();

        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error(error);
          Alert.alert('Error fetching data');
        }

        if (data) {
          // Map DB snake_case to Frontend camelCase
          const mapped: Subscription[] = data.map((item: any) => ({
            id: item.id.toString(),
            name: item.name,
            price: item.price,
            type: item.type,
            billingCycle: item.billing_cycle,
            category: item.category || 'Other',
            renewalDate: item.renewal_date,
            reminderDays: item.reminder_days || 3, // Default if null
            reminderEnabled: item.reminder_enabled || false,
            created_at: item.created_at
          }));
          set({ subscriptions: mapped });
        }
        set({ isLoading: false });
      },

      addSubscription: async (sub) => {
        const { session, subscriptions, canAddSubscription } = get();
        console.log('STORE: addSubscription', { session: session?.user?.id, sub });

        if (!session) {
          console.error('STORE: No session found in addSubscription');
          Alert.alert('Error', 'You must be logged in to save.');
          return;
        }

        if (!canAddSubscription()) {
          Alert.alert('Limit Reached', 'You have reached the limit of 5 subscriptions. Upgrade to Premium to add more.');
          return;
        }

        const optimisticId = Math.random().toString();
        // Optimistic Update
        const optimisticSub = { ...sub, id: optimisticId };
        set({ subscriptions: [optimisticSub, ...subscriptions] });

        const { data, error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: session.user.id,
            name: sub.name,
            price: sub.price,
            type: sub.type,
            billing_cycle: sub.billingCycle,
            category: sub.category,
            renewal_date: sub.renewalDate,
            // Assuming we add columns for reminders later in SQL or ignore them for now
          })
          .select()
          .single();

        if (error) {
          console.error(error);
          console.error(error);
          // If backend trigger fails (double check), frontend should catch it too
          Alert.alert('Save Failed', `Code: ${error.code}\nMessage: ${error.message}\nDetails: ${error.details || 'None'}`);
          // Revert optimistic update
          set({ subscriptions: subscriptions });
          return;
        }

        if (data) {
          // Replace optimistic ID with real ID
          const realSub: Subscription = {
            id: data.id.toString(),
            name: data.name,
            price: data.price,
            type: data.type,
            billingCycle: data.billing_cycle,
            category: data.category || 'Other',
            renewalDate: data.renewal_date,
            reminderDays: 3,
            reminderEnabled: false,
          };

          set((state) => ({
            subscriptions: state.subscriptions.map(s => s.id === optimisticId ? realSub : s)
          }));
        }
      },

      removeSubscription: async (id) => {
        // Optimistic delete
        const { subscriptions } = get();
        set({ subscriptions: subscriptions.filter(s => s.id !== id) });

        const { error } = await supabase
          .from('subscriptions')
          .delete()
          .eq('id', id);

        if (error) {
          console.error(error);
          Alert.alert('Error deleting');
          set({ subscriptions }); // Revert
        }
      },

      updateSubscription: async (id, updates) => {
        const { subscriptions } = get();
        // Optimistic update
        set({
          subscriptions: subscriptions.map(s => s.id === id ? { ...s, ...updates } : s)
        });

        // Map updates to snake_case
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.price) dbUpdates.price = updates.price;
        if (updates.type) dbUpdates.type = updates.type;
        if (updates.billingCycle) dbUpdates.billing_cycle = updates.billingCycle;
        if (updates.category) dbUpdates.category = updates.category;
        if (updates.renewalDate) dbUpdates.renewal_date = updates.renewalDate;

        const { error } = await supabase
          .from('subscriptions')
          .update(dbUpdates)
          .eq('id', id);

        if (error) {
          console.error(error);
          set({ subscriptions }); // Revert
        }
      },

      getActiveTotal: () => {
        const { subscriptions } = get();
        return subscriptions
          .filter((s) => s.type === 'active')
          .reduce((total, sub) => {
            const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
            return total + monthlyPrice;
          }, 0);
      },

      getTrialRisk: () => {
        const { subscriptions } = get();
        return subscriptions
          .filter((s) => s.type === 'trial')
          .reduce((total, sub) => {
            return total + sub.price;
          }, 0);
      },

      getNextMonthForecast: () => {
        const { subscriptions } = get();
        const now = new Date();
        const thirtyDaysFromNow = addDays(now, 30);
        let total = 0;

        subscriptions.forEach(sub => {
          if (sub.type !== 'active') return;

          // Simple logic: if billing cycle is monthly, it WILL occur in next 30 days
          if (sub.billingCycle === 'monthly') {
            total += sub.price;
          } else {
            // Yearly: only if renewal date is within next 30 days
            if (!sub.renewalDate) return;

            try {
              const renewal = parseISO(sub.renewalDate);
              // Check if valid date
              if (isNaN(renewal.getTime())) return;

              // We need to handle "past" renewal dates by projecting them to this year
              // But for MVP let's assume renewalDate is the NEXT renewal date
              if (isAfter(renewal, now) && isBefore(renewal, thirtyDaysFromNow)) {
                total += sub.price;
              }
            } catch (e) {
              console.warn('Invalid renewal date for sub', sub.id);
            }
          }
        });
        return total;
      }
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
