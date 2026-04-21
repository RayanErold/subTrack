
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

import { useTheme } from '../../hooks/useTheme';

export default function TabLayout() {
  const { currentPrimary, currentBg } = useTheme();
  
  const theme = Colors.dark;
  const activeColor = currentPrimary;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: '#333',
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerShown: false, // We use custom headers in screens usually
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add New',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color }) => <TabBarIcon name="diamond" color={color} />,
        }}
      />
      <Tabs.Screen
        name="theme"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
