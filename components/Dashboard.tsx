import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Colors from '../constants/Colors';
import { useSubscriptionStore } from '../store/useSubscriptionStore';

interface Props {
    activeTotal: number;
    activeCount: number;
    trialRisk: number;
    trialCount: number;
    forecast: number;
}

export default function Dashboard({ activeTotal, activeCount, trialRisk, trialCount, forecast }: Props) {
    const { theme, currency } = useSubscriptionStore();
    const currentPrimary = theme.enabled ? theme.primaryColor : Colors.dark.primary;
    const currentSecondary = theme.enabled ? theme.secondaryColor : Colors.dark.secondary;
    const currentFont = (theme.enabled && theme.font !== 'System') ? theme.font : undefined;

    const isLightBg = theme.enabled && (theme.backgroundColor === '#ffffff' || theme.backgroundColor.toLowerCase() === 'white');
    const textColor = isLightBg ? '#000' : '#fff';
    const subTextColor = isLightBg ? '#444' : 'rgba(255,255,255,0.6)';
    const labelColor = isLightBg ? '#666' : 'rgba(255,255,255,0.8)';
    const cardBg = isLightBg ? 'rgba(0,0,0,0.05)' : Colors.dark.surface;
    const forecastBg = isLightBg ? 'rgba(0,0,0,0.03)' : '#1E1E24';

    return (
        <View style={styles.container}>
            {/* Main Monthly Spend Card */}
            <View style={[styles.card, styles.mainCard, { backgroundColor: cardBg, borderColor: isLightBg ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }]}>
                <Text style={[styles.label, { fontFamily: currentFont, color: labelColor }]}>Monthly Recurring</Text>
                <Text style={[styles.hugeAmount, { fontFamily: currentFont, color: textColor }]}>{currency}{activeTotal.toFixed(2)}</Text>
                <Text style={[styles.subtext, { fontFamily: currentFont, color: subTextColor }]}>{activeCount} active subscriptions</Text>
            </View>

            {/* Forecast Card */}
            <View style={[styles.card, styles.forecastCard, { backgroundColor: forecastBg, borderColor: isLightBg ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }, theme.enabled && { borderLeftColor: currentSecondary, borderLeftWidth: 4 }]}>
                <Text style={[styles.label, { fontFamily: currentFont, color: labelColor }]}>Next 30 Days Forecast</Text>
                <Text style={[styles.forecastAmount, { fontFamily: currentFont, color: theme.enabled ? currentSecondary : textColor }]}>{currency}{forecast.toFixed(2)}</Text>
                <Text style={[styles.subtext, { fontFamily: currentFont, color: subTextColor }]}>Estimated upcoming charges</Text>
            </View>

            {/* Trial Loading (Risk) Card */}
            {trialRisk > 0 && (
                <View style={[styles.card, styles.riskCard, theme.enabled && { borderLeftColor: currentSecondary, borderLeftWidth: 4 }]}>
                    <View>
                        <Text style={[styles.riskLabel, { fontFamily: currentFont }]}>Potential Charges</Text>
                        <Text style={[styles.riskAmount, { fontFamily: currentFont, color: theme.enabled ? currentSecondary : '#fff' }]}>{currency}{trialRisk.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.warningIcon, theme.enabled && { backgroundColor: currentSecondary }]}>
                        <Text style={{ fontSize: 20 }}>⚠️</Text>
                    </View>
                    <Text style={[styles.riskSubtext, { fontFamily: currentFont }]}>from {trialCount} trials ending soon</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        gap: 12,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
    },
    mainCard: {
        backgroundColor: Colors.dark.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        // Simplified web-safe shadow
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
            web: {
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)', // CSS standard shadow
            }
        }),
    },
    forecastCard: {
        backgroundColor: '#1E1E24', // Slightly lighter/different dark
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    riskCard: {
        backgroundColor: 'rgba(255, 101, 132, 0.15)', // Light red bg
        borderWidth: 1,
        borderColor: Colors.dark.secondary,
    },
    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    hugeAmount: {
        color: '#fff',
        fontSize: 42,
        fontWeight: '800',
        marginVertical: 4,
    },
    subtext: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    riskLabel: {
        color: Colors.dark.secondary,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    riskAmount: {
        color: Colors.dark.secondary,
        fontSize: 24,
        fontWeight: '800',
    },
    riskSubtext: {
        color: Colors.dark.secondary,
        fontSize: 12,
        marginTop: 4
    },
    forecastAmount: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '700',
        marginVertical: 4,
    },
    warningIcon: {
        position: 'absolute',
        right: 20,
        top: 20,
    }
});
