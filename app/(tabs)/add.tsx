
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Input from '../../components/Input';
import Paywall from '../../components/Paywall';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { SubscriptionType, BillingCycle } from '../../types';
import { addYears, addMonths, format } from 'date-fns';
import { scheduleRenewalNotification, registerForPushNotificationsAsync } from '../../utils/notifications';
import { predictServiceDetails, Category, CATEGORIES } from '../../utils/smartCategories';

export default function TabAddScreen() {
    const router = useRouter();
    const { addSubscription, canAddSubscription, isPremium, setPremium, upgradeToPremium, theme, currency } = useSubscriptionStore();
    const currentPrimary = theme.enabled ? theme.primaryColor : Colors.dark.primary;
    const currentFont = (theme.enabled && theme.font !== 'System') ? theme.font : undefined;
    const currentBg = theme.enabled ? theme.backgroundColor : Colors.dark.background;

    const isLightBg = theme.enabled && (currentBg === '#ffffff' || currentBg.toLowerCase() === 'white');
    const textColor = isLightBg ? '#000' : '#fff';
    const subTextColor = isLightBg ? '#666' : '#bbb';
    const cardBg = isLightBg ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
    const toggleBg = isLightBg ? 'rgba(0,0,0,0.05)' : '#1c1c1e';

    const [type, setType] = useState<SubscriptionType>('active');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [cycle, setCycle] = useState<BillingCycle>('monthly');
    const [category, setCategory] = useState<Category>('Other');
    const [renewal, setRenewal] = useState(''); // Initial simple text input for date YYYY-MM-DD for MVP speed
    const [cancelUrl, setCancelUrl] = useState('');
    const [remind, setRemind] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);

    React.useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    const handleNameChange = (text: string) => {
        setName(text);

        // AI / Smart Auto-fill
        const prediction = predictServiceDetails(text);
        if (prediction) {
            // Only auto-fill if fields are empty to avoid annoying the user
            if (!price) setPrice(prediction.defaultPrice.toString());
            setCycle(prediction.billingCycle);
            setCategory(prediction.category);
            // We could also set an icon here if we had that state
        }
    };

    const handleSave = () => {
        console.log('UI: handleSave pressed');
        // 1. Limit Check
        if (!canAddSubscription()) {
            setShowPaywall(true);
            return;
        }

        if (!name || !price) {
            Alert.alert('Error', 'Please fill in Name and Price');
            return;
        }

        // 2. Direct Save
        saveSubscription();
    };

    const saveSubscription = () => {
        if (!name || !price) {
            Alert.alert('Error', 'Please fill in Name and Price');
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum)) {
            Alert.alert('Error', 'Invalid price');
            return;
        }

        // Default renewal to 1 month from now if empty
        let renewalDate = renewal;
        if (!renewalDate) {
            const now = new Date();
            const next = cycle === 'monthly' ? addMonths(now, 1) : addYears(now, 1);
            renewalDate = next.toISOString();
        } else {
            // Very basic validation/parsing for MVP "2024-02-10"
            // If user types simple date, try to parse
            const d = new Date(renewalDate);
            if (isNaN(d.getTime())) {
                // Fallback
                renewalDate = new Date().toISOString();
            } else {
                renewalDate = d.toISOString();
            }
        }

        addSubscription({
            name,
            price: priceNum,
            type,
            billingCycle: cycle,
            category,
            renewalDate,
            reminderDays: 3,
            reminderEnabled: remind,
            cancelUrl
        });

        // Schedule notification if enabled
        if (remind) {
            scheduleRenewalNotification(name, renewalDate, isPremium, cancelUrl);
        }

        router.replace('/(tabs)');
        // Reset form
        setName('');
        setPrice('');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: currentBg }]} contentContainerStyle={styles.content}>
            <Paywall
                visible={showPaywall}
                onClose={() => setShowPaywall(false)}
                onPurchase={async () => {
                    const success = await upgradeToPremium();
                    if (success) {
                        setShowPaywall(false);
                        Alert.alert("Welcome to Premium", "You now have unlimited access!");
                    } else {
                        Alert.alert("Error", "Could not sync upgrade with server. Please contact support if you were charged.");
                    }
                }}
            />

            {/* Premium Badge Demo */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.header, { fontFamily: currentFont, color: textColor }]}>Add Subscription</Text>
                {!isPremium && (
                    <Pressable onPress={() => setShowPaywall(true)}>
                        <Text style={{ color: currentPrimary, fontFamily: currentFont }}>Upgrade</Text>
                    </Pressable>
                )}
            </View>

            {/* Type Toggle */}
            <View style={[styles.toggleContainer, { backgroundColor: toggleBg }]}>
                <Pressable
                    style={[styles.toggleBtn, type === 'active' && [styles.toggleBtnActive, { backgroundColor: currentPrimary }]]}
                    onPress={() => setType('active')}
                >
                    <Text style={[styles.toggleText, type === 'active' && styles.toggleTextActive, { fontFamily: currentFont, color: type === 'active' ? '#fff' : subTextColor }]}>Active Sub</Text>
                </Pressable>
                <Pressable
                    style={[styles.toggleBtn, type === 'trial' && [styles.toggleBtnTrial, { backgroundColor: currentPrimary }]]}
                    onPress={() => setType('trial')}
                >
                    <Text style={[styles.toggleText, type === 'trial' && styles.toggleTextActive, { fontFamily: currentFont, color: type === 'trial' ? '#fff' : subTextColor }]}>Free Trial</Text>
                </Pressable>
            </View>
            <Input label="Service Name" placeholder="e.g. Netflix" value={name} onChangeText={handleNameChange} />

            <Input
                label={type === 'trial' ? `Future Price (${currency})` : `Price (${currency})`}
                placeholder={`${currency}0.00`}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
            />

            {/* Cycle Segment */}
            <View style={styles.row}>
                <Text style={[styles.label, { fontFamily: currentFont, color: subTextColor }]}>Billing Cycle</Text>
                <View style={styles.cycleToggle}>
                    <Pressable onPress={() => setCycle('monthly')} style={[styles.cycleBtn, cycle === 'monthly' && [styles.cycleBtnActive, { backgroundColor: currentPrimary, borderColor: currentPrimary }]]}>
                        <Text style={[styles.cycleText, { fontFamily: currentFont, color: cycle === 'monthly' ? '#fff' : subTextColor }]}>Monthly</Text>
                    </Pressable>
                    <Pressable onPress={() => setCycle('yearly')} style={[styles.cycleBtn, cycle === 'yearly' && [styles.cycleBtnActive, { backgroundColor: currentPrimary, borderColor: currentPrimary }]]}>
                        <Text style={[styles.cycleText, { fontFamily: currentFont, color: cycle === 'yearly' ? '#fff' : subTextColor }]}>Yearly</Text>
                    </Pressable>
                </View>
            </View>

            {/* Category Selection */}
            <View style={styles.row}>
                <Text style={[styles.label, { fontFamily: currentFont, color: subTextColor }]}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {CATEGORIES.map((cat) => {
                        const isSelected = category === cat.id;
                        return (
                            <Pressable 
                                key={cat.id} 
                                style={[
                                    styles.categoryBtn, 
                                    { borderColor: isLightBg ? '#e5e5ea' : '#333' },
                                    isSelected && { backgroundColor: cat.color, borderColor: cat.color }
                                ]}
                                onPress={() => setCategory(cat.id)}
                            >
                                <Ionicons name={cat.icon as any} size={18} color={isSelected ? '#fff' : subTextColor} />
                                <Text style={[styles.categoryBtnText, { fontFamily: currentFont, color: isSelected ? '#fff' : subTextColor }]}>
                                    {cat.id}
                                </Text>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </View>

            <Input
                label={type === 'trial' ? "Trial Ends (YYYY-MM-DD)" : "Next Renewal (YYYY-MM-DD)"}
                placeholder="YYYY-MM-DD"
                value={renewal}
                onChangeText={setRenewal}
            />

            <Input
                label="Cancellation URL (Optional)"
                placeholder="https://..."
                value={cancelUrl}
                onChangeText={setCancelUrl}
                autoCapitalize="none"
            />

            {/* Reminder Toggle */}
            <Pressable style={[styles.remindRow, { backgroundColor: cardBg }]} onPress={() => setRemind(!remind)}>
                <Text style={[styles.remindLabel, { fontFamily: currentFont, color: textColor }]}>Remind me 1 day before?</Text>
                <View style={[styles.switch, remind && { backgroundColor: currentPrimary }]}>
                    <View style={[styles.switchKnob, remind && styles.switchKnobOn]} />
                </View>
            </Pressable>

            <Pressable style={[styles.saveBtn, { backgroundColor: currentPrimary }]} onPress={handleSave}>
                <Text style={[styles.saveBtnText, { fontFamily: currentFont }]}>Save Subscription</Text>
            </Pressable>

        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#1c1c1e',
        padding: 4,
        borderRadius: 12,
        marginBottom: 24,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    toggleBtnActive: {
        backgroundColor: Colors.dark.tint,
    },
    toggleBtnTrial: {
        backgroundColor: Colors.dark.warning,
    },
    toggleText: {
        color: '#666',
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#fff', // for active blue
        // for trial yellow, usually black text is better contrast
    },
    row: {
        marginBottom: 20,
    },
    label: {
        color: '#bbb',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    cycleToggle: {
        flexDirection: 'row',
        gap: 12,
    },
    cycleBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    cycleBtnActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    cycleText: {
        color: Colors.dark.text,
    },
    categoryScroll: {
        paddingVertical: 10,
        gap: 10,
    },
    categoryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    categoryBtnText: {
        marginLeft: 8,
        fontWeight: '600',
    },
    saveBtn: {
        backgroundColor: Colors.dark.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    remindRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20
    },
    remindLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    switch: {
        width: 50,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        justifyContent: 'center',
        padding: 2
    },
    switchOn: {
        backgroundColor: Colors.dark.success
    },
    switchKnob: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#fff'
    },
    switchKnobOn: {
        alignSelf: 'flex-end'
    }
});
