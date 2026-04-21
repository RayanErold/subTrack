import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Alert, Platform } from 'react-native';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase';

import { useTheme } from '../../hooks/useTheme';

// Extracted Components
import { SettingsSectionHeader } from '../../components/settings/SettingsSectionHeader';
import { SettingsActionItem } from '../../components/settings/SettingsActionItem';
import { CustomizationSection } from '../../components/settings/CustomizationSection';

export default function SettingsScreen() {
    const router = useRouter();
    const {
        session,
        isPremium,
        setPremium,
        downgradeToFree,
        notificationsEnabled,
        setNotificationsEnabled,
        currency,
        setCurrency,
        subscriptions,
        exportStoreData,
        setTheme
    } = useSubscriptionStore();

    const { 
        isLightBg, 
        currentPrimary, 
        currentSecondary, 
        currentBg, 
        currentFont, 
        textColor, 
        subTextColor, 
        cardBg, 
        theme 
    } = useTheme();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Error logging out', error.message);
        } else {
            router.replace('/(auth)');
        }
    };

    const handleExport = () => {
        const data = exportStoreData();
        Alert.alert(
            'Data Exported',
            'Your data has been formatted as JSON. In a production app, this would Save to File or send via Email.',
            [
                { text: 'Copy to Clipboard', onPress: () => Alert.alert('Copied!', 'JSON data copied to clipboard (simulated)') },
                { text: 'Done' }
            ]
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache',
            'Are you sure? This will remove locally cached data and require a fresh sync.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Cleared', 'Local cache cleared.') }
            ]
        );
    };

    const Currencies = ['$', '€', '£', '¥', '₹', '₩'];

    return (
        <View style={[styles.container, { backgroundColor: theme.enabled ? currentBg : '#000' }]}>
            <Stack.Screen options={{
                title: 'Settings',
                headerStyle: { backgroundColor: theme.enabled ? currentBg : '#000' },
                headerTintColor: textColor,
                headerShown: true,
                headerLeft: () => (
                    <Pressable onPress={() => router.back()} style={{ marginLeft: 10 }}>
                        <Ionicons name="arrow-back" size={24} color={textColor} />
                    </Pressable>
                )
            }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}>

                {/* Account Section */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <SettingsSectionHeader title="Account" icon="person-circle" color={currentPrimary} />
                    <View style={styles.accountRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.emailText, { color: textColor }]}>{session?.user?.email || 'User'}</Text>
                            <Text style={[styles.planLabel, { color: subTextColor }]}>{isPremium ? '💎 PRO PLAN' : 'FREE PLAN'}</Text>
                        </View>
                        <View style={styles.accountActions}>
                            {!isPremium && (
                                <Pressable
                                    style={[styles.upgradeBtn, { borderColor: currentPrimary }]}
                                    onPress={() => router.push('/payment')}
                                >
                                    <Text style={[styles.upgradeText, { color: currentPrimary }]}>Upgrade</Text>
                                </Pressable>
                            )}
                            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                                <Text style={styles.logoutText}>Log Out</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Notifications Section */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <SettingsSectionHeader title="Notifications" icon="notifications-outline" color={currentPrimary} />
                    <View style={styles.toggleRow}>
                        <View>
                            <Text style={[styles.rowTitle, { color: textColor }]}>Push Notifications</Text>
                            <Text style={[styles.rowSubtitle, { color: subTextColor }]}>Reminders before a trial ends</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#333', true: currentPrimary }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* General Section */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <SettingsSectionHeader title="General" icon="options" color={currentPrimary} />
                    <Text style={[styles.subLabel, { color: subTextColor }]}>Primary Currency</Text>
                    <View style={styles.currencyGrid}>
                        {Currencies.map((c) => (
                            <Pressable
                                key={c}
                                onPress={() => setCurrency(c)}
                                style={[
                                    styles.currencyOption,
                                    { backgroundColor: cardBg },
                                    currency === c && { borderColor: currentPrimary }
                                ]}
                            >
                                <Text style={[styles.currencyText, { color: currency === c ? currentPrimary : textColor }]}>{c}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Customization Section (Premium Only) */}
                <CustomizationSection
                    theme={theme}
                    setTheme={setTheme}
                    isPremium={isPremium}
                    currency={currency}
                    currentPrimary={currentPrimary}
                    textColor={textColor}
                    subTextColor={subTextColor}
                    cardBg={cardBg}
                    currentBg={currentBg}
                    currentFont={currentFont}
                    currentSecondary={currentSecondary}
                />

                {/* Plan & Billing Section (Management) */}
                {isPremium && (
                    <View style={[styles.card, { backgroundColor: cardBg }]}>
                        <SettingsSectionHeader title="Plan & Billing" icon="card" color={currentPrimary} />
                        <View style={styles.planInfoRow}>
                            <View>
                                <Text style={[styles.rowTitle, { color: textColor }]}>Premium Plan</Text>
                                <Text style={[styles.rowSubtitle, { color: subTextColor }]}>Active • Unlimited Access</Text>
                            </View>
                            <Pressable
                                style={styles.downgradeBtn}
                                onPress={async () => {
                                    if (Platform.OS === 'web') {
                                        const confirmed = window.confirm('Are you sure? You will lose unlimited subscription limits and custom themes.');
                                        if (confirmed) {
                                            const success = await downgradeToFree();
                                            if (success) {
                                                alert('Your account is now on the Free tier.');
                                            } else {
                                                alert('Could not sync downgrade with server. Please try again.');
                                            }
                                        }
                                        return;
                                    }

                                    Alert.alert(
                                        'Downgrade to Free',
                                        'Are you sure? You will lose unlimited subscription limits and custom themes.',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Downgrade',
                                                style: 'destructive',
                                                onPress: async () => {
                                                    const success = await downgradeToFree();
                                                    if (success) {
                                                        Alert.alert('Downgraded', 'Your account is now on the Free tier.');
                                                    } else {
                                                        Alert.alert('Error', 'Could not sync downgrade with server. Please try again.');
                                                    }
                                                }
                                            },
                                        ]
                                    );
                                }}
                            >
                                <Text style={styles.downgradeText}>Downgrade</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                {/* Data & Privacy */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <SettingsSectionHeader title="Data & Privacy" icon="shield-checkmark" color={currentPrimary} />
                    <View style={styles.actionList}>
                        <SettingsActionItem
                            label="Export Data (JSON)"
                            icon="download-outline"
                            iconColor={currentPrimary}
                            onPress={handleExport}
                            textColor={textColor}
                            subTextColor={subTextColor}
                        />
                        <SettingsActionItem
                            label="Clear Local Cache"
                            icon="trash-outline"
                            iconColor="#FF4554"
                            onPress={handleClearCache}
                            textColor="#FF4554"
                            subTextColor={subTextColor}
                        />
                    </View>
                </View>

                {/* Support & Feedback */}
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                    <SettingsSectionHeader title="Support & Feedback" icon="help-circle" color={currentPrimary} />
                    <View style={styles.actionList}>
                        <SettingsActionItem
                            label="Contact Support"
                            icon="chatbubble-ellipses-outline"
                            iconColor={currentPrimary}
                            onPress={() => Alert.alert('Support', 'Redirecting to help center...')}
                            textColor={textColor}
                            subTextColor={subTextColor}
                        />
                        <SettingsActionItem
                            label="Report a Bug"
                            icon="bug-outline"
                            iconColor="#fff"
                            onPress={() => Alert.alert('Bug Report', 'Please describe the issue...')}
                            textColor={textColor}
                            subTextColor={subTextColor}
                        />
                    </View>
                </View>


                {/* Final Done Button */}
                <Pressable
                    style={[styles.doneButton, { borderColor: currentPrimary }]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={20} color={currentPrimary} />
                    <Text style={[styles.doneButtonText, { color: currentPrimary, fontFamily: currentFont === 'System' ? undefined : currentFont }]}>Done & Go Back</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    card: { marginTop: 20, borderRadius: 20, padding: 16 },
    accountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    emailText: { fontSize: 16, fontWeight: 'bold' },
    planLabel: { fontSize: 12, marginTop: 2, fontWeight: 'bold' },
    accountActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    upgradeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, backgroundColor: 'transparent' },
    upgradeText: { fontWeight: 'bold', fontSize: 13 },
    logoutBtn: { backgroundColor: 'rgba(255,69,84,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,69,84,0.3)' },
    logoutText: { color: '#FF4554', fontWeight: 'bold', fontSize: 13 },
    toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    rowTitle: { fontSize: 16, fontWeight: 'bold' },
    rowSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
    subLabel: { color: '#666', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12, marginTop: 8 },
    currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    currencyOption: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    currencyText: { fontSize: 18, fontWeight: 'bold' },
    actionList: { marginTop: 8 },
    planInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    downgradeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(255,69,84,0.3)', backgroundColor: 'rgba(255,69,84,0.05)' },
    downgradeText: { color: '#FF4554', fontWeight: 'bold', fontSize: 13 },
    doneButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1.5, backgroundColor: 'transparent', alignSelf: 'center', paddingHorizontal: 24, marginTop: 30 },
    doneButtonText: { fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
});

