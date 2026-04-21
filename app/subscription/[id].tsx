
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import Colors from '../../constants/Colors';
import Input from '../../components/Input';
import { useSubscriptionStore, SubscriptionType, BillingCycle } from '../../store/useSubscriptionStore';
import { addYears, addMonths } from 'date-fns';
import { openGoogleCalendar } from '../../utils/calendar';

export default function EditSubscriptionScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { subscriptions, updateSubscription, removeSubscription, isPremium, setPremium, theme: appTheme } = useSubscriptionStore();

    const currentPrimary = appTheme.primaryColor;
    const currentFont = appTheme.font === 'System' ? undefined : appTheme.font;

    const [sub, setSub] = useState(subscriptions.find(s => s.id === id));

    // State
    const [type, setType] = useState<SubscriptionType>('active');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [cycle, setCycle] = useState<BillingCycle>('monthly');
    const [renewal, setRenewal] = useState('');
    const [cancelUrl, setCancelUrl] = useState('');
    const [remind, setRemind] = useState(true);

    useEffect(() => {
        const found = subscriptions.find(s => s.id === id);
        if (found) {
            setSub(found);
            setType(found.type);
            setName(found.name);
            setPrice(found.price.toString());
            setCycle(found.billingCycle);
            setRenewal(found.renewalDate);
            setCancelUrl(found.cancelUrl || '');
            setRemind(found.reminderEnabled ?? true);
        } else {
            Alert.alert("Error", "Subscription not found");
            router.back();
        }
    }, [id, subscriptions]);

    const handleUpdate = () => {
        if (!name || !price) {
            Alert.alert('Error', 'Please fill in Name and Price');
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum)) {
            Alert.alert('Error', 'Invalid price');
            return;
        }

        updateSubscription(id as string, {
            name,
            price: priceNum,
            type,
            billingCycle: cycle,
            renewalDate: renewal, // Assume user keeps ISO format or edits carefully for now
            cancelUrl
        });

        router.back();
    };

    const handleDelete = () => {
        // Direct delete to fix Web compatibility issues with Alert
        removeSubscription(id as string);
        router.back();
    };

    if (!sub) return <View style={styles.container}><Text style={{ color: '#fff' }}>Loading...</Text></View>;

    return (
        <ScrollView style={[styles.container, { backgroundColor: appTheme.enabled ? appTheme.backgroundColor : Colors.dark.background }]} contentContainerStyle={styles.content}>
            <Stack.Screen options={{
                title: 'Edit Subscription',
                headerStyle: { backgroundColor: appTheme.enabled ? appTheme.backgroundColor : Colors.dark.background },
                headerTintColor: '#fff',
                headerLeft: () => (
                    <Pressable onPress={() => router.back()} style={{ marginLeft: 0 }}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </Pressable>
                )
            }} />

            <View style={styles.headerRow}>
                <Text style={[styles.header, { fontFamily: currentFont }]}>Edit Details</Text>
                <Pressable onPress={handleDelete}>
                    <Text style={[styles.deleteText, { fontFamily: currentFont }]}>Delete</Text>
                </Pressable>
            </View>

            {/* Type Toggle */}
            <View style={styles.toggleContainer}>
                <Pressable
                    style={[styles.toggleBtn, type === 'active' && [styles.toggleBtnActive, { backgroundColor: currentPrimary }]]}
                    onPress={() => setType('active')}
                >
                    <Text style={[styles.toggleText, type === 'active' && styles.toggleTextActive, { fontFamily: currentFont }]}>Active Sub</Text>
                </Pressable>
                <Pressable
                    style={[styles.toggleBtn, type === 'trial' && [styles.toggleBtnTrial, { backgroundColor: currentPrimary }]]}
                    onPress={() => setType('trial')}
                >
                    <Text style={[styles.toggleText, type === 'trial' && styles.toggleTextActive, { fontFamily: currentFont }]}>Free Trial</Text>
                </Pressable>
            </View>

            <Input label="Service Name" value={name} onChangeText={setName} />

            <Input
                label={type === 'trial' ? "Future Charge Amount" : "Monthly/Yearly Price"}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
            />

            {/* Cycle Segment */}
            <View style={styles.row}>
                <Text style={[styles.label, { fontFamily: currentFont }]}>Billing Cycle</Text>
                <View style={styles.cycleToggle}>
                    <Pressable onPress={() => setCycle('monthly')} style={[styles.cycleBtn, cycle === 'monthly' && [styles.cycleBtnActive, { backgroundColor: currentPrimary, borderColor: currentPrimary }]]}>
                        <Text style={[styles.cycleText, { fontFamily: currentFont, color: cycle === 'monthly' ? '#fff' : '#fff' }]}>Monthly</Text>
                    </Pressable>
                    <Pressable onPress={() => setCycle('yearly')} style={[styles.cycleBtn, cycle === 'yearly' && [styles.cycleBtnActive, { backgroundColor: currentPrimary, borderColor: currentPrimary }]]}>
                        <Text style={[styles.cycleText, { fontFamily: currentFont, color: cycle === 'yearly' ? '#fff' : '#fff' }]}>Yearly</Text>
                    </Pressable>
                </View>
            </View>

            <Input
                label={type === 'trial' ? "Trial Ends (YYYY-MM-DD)" : "Next Renewal (YYYY-MM-DD)"}
                value={renewal}
                onChangeText={setRenewal}
            />

            <Input
                label="Cancel URL"
                value={cancelUrl}
                onChangeText={setCancelUrl}
                autoCapitalize="none"
            />

            {/* Calendar Link - Premium */}
            <Pressable
                style={[styles.remindRow, { marginTop: 0, marginBottom: 12 }]}
                onPress={() => {
                    if (!isPremium) {
                        Alert.alert("Premium Feature", "Google Calendar Sync is for Pro users.\nUpgrade to unlock!", [
                            { text: "Cancel", style: 'cancel' },
                            { text: "Upgrade (Demo)", onPress: () => setPremium(true) }
                        ]);
                        return;
                    }
                    openGoogleCalendar(name, renewal, `Price: $${price} - ${cancelUrl}`);
                }}
            >
                <Text style={styles.remindLabel}>Add to Google Calendar 📅</Text>
                {!isPremium && <Text style={{ fontSize: 10, color: Colors.dark.warning }}>PRO</Text>}
            </Pressable>

            <Pressable style={styles.remindRow} onPress={() => setRemind(!remind)}>
                <Text style={styles.remindLabel}>Remind me 1 day before?</Text>
                <View style={[styles.switch, remind && styles.switchOn]}>
                    <View style={[styles.switchKnob, remind && styles.switchKnobOn]} />
                </View>
            </Pressable>

            <Pressable style={[styles.saveBtn, { backgroundColor: currentPrimary }]} onPress={handleUpdate}>
                <Text style={[styles.saveBtnText, { fontFamily: currentFont }]}>Update Subscription</Text>
            </Pressable>

            {/* Manual Go Back Button */}
            <Pressable
                style={[styles.backBtn, { borderColor: currentPrimary }]}
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={20} color={currentPrimary} />
                <Text style={[styles.backBtnText, { color: currentPrimary, fontFamily: currentFont }]}>Cancel & Go Back</Text>
            </Pressable>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    deleteText: {
        color: Colors.dark.secondary,
        fontSize: 16,
        fontWeight: '600'
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
        color: '#fff',
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
        marginBottom: 20,
        marginTop: 10
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
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        marginTop: 12,
        backgroundColor: 'transparent',
        marginBottom: 20,
        alignSelf: 'center',
        paddingHorizontal: 24
    },
    backBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});
