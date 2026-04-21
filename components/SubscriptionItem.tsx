
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import Colors from '../constants/Colors';
import { useSubscriptionStore, Subscription } from '../store/useSubscriptionStore';

interface Props {
    subscription: Subscription;
    onPress: () => void;
}

export default function SubscriptionItem({ subscription, onPress }: Props) {
    const { theme: appTheme, currency } = useSubscriptionStore();
    const currentPrimary = appTheme.enabled ? appTheme.primaryColor : Colors.dark.primary;
    const currentSecondary = appTheme.enabled ? appTheme.secondaryColor : Colors.dark.secondary;
    const currentFont = (appTheme.enabled && appTheme.font !== 'System') ? appTheme.font : undefined;

    const isLightBg = appTheme.enabled && (appTheme.backgroundColor === '#ffffff' || appTheme.backgroundColor.toLowerCase() === 'white');
    const textColor = isLightBg ? '#000' : Colors.dark.text;
    const subTextColor = isLightBg ? '#666' : '#888';
    const cardBg = isLightBg ? 'rgba(0,0,0,0.05)' : Colors.dark.card;
    const cardBorder = isLightBg ? 'rgba(0,0,0,0.1)' : '#333';
    const isTrial = subscription.type === 'trial';

    // Calculate renewal text
    const renewalDate = new Date(subscription.renewalDate);
    const timeUntil = formatDistanceToNow(renewalDate, { addSuffix: true });

    return (
        <Pressable
            style={({ pressed }) => [styles.container, { backgroundColor: cardBg, borderColor: cardBorder }, pressed && styles.pressed]}
            onPress={onPress}
        >
            <View style={styles.info}>
                <Text style={[styles.name, { fontFamily: currentFont, color: textColor }]}>{subscription.name}</Text>
                <Text style={[styles.renewal, { fontFamily: currentFont, color: subTextColor }, isTrial && { color: currentPrimary, fontWeight: '600' }]}>
                    {isTrial ? 'Trial ends' : 'Renews'} {timeUntil}
                </Text>
            </View>

            <View style={styles.amountContainer}>
                <Text style={[styles.price, { fontFamily: currentFont, color: appTheme.enabled ? currentPrimary : textColor }]}>
                    {currency}{subscription.price.toFixed(2)}
                </Text>
                <Text style={[styles.cycle, { fontFamily: currentFont, color: subTextColor }]}>
                    /{subscription.billingCycle.substr(0, 2)}
                </Text>
            </View>

            {isTrial && (
                <View style={[styles.trialTag, { backgroundColor: currentPrimary }]}>
                    <Text style={[styles.trialTagText, { fontFamily: currentFont }]}>TRIAL</Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.card,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    pressed: {
        opacity: 0.8,
    },
    info: {
        flex: 1,
    },
    name: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    renewal: {
        color: '#888',
        fontSize: 14,
    },
    trialText: {
        color: Colors.dark.warning,
        fontWeight: '600',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    price: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    cycle: {
        color: '#666',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    trialTag: {
        position: 'absolute',
        top: -8,
        right: 12,
        backgroundColor: Colors.dark.warning,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    trialTagText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
