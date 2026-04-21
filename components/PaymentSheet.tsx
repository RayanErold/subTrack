import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Colors from '../constants/Colors';

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
    amount: string;
    planName: string;
    trialDuration?: string;
}

export default function PaymentSheet({ onSuccess, onCancel, amount, planName, trialDuration }: Props) {
    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handlePay = () => {
        // Mock Validation
        if (cardNumber.length < 16 || expiry.length < 4 || cvc.length < 3) {
            Alert.alert("Invalid Card", "Please check your card details.");
            return;
        }

        setLoading(true);

        // Simulate Stripe API call
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{trialDuration ? 'Start Free Trial' : 'Secure Payment'}</Text>
            <Text style={{ color: '#aaa', textAlign: 'center', marginBottom: 20 }}>
                {trialDuration ? (
                    <>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{trialDuration} Free</Text>, then {amount} for {planName}
                    </>
                ) : (
                    <>
                        Upgrading to <Text style={{ color: '#fff', fontWeight: 'bold' }}>{planName}</Text>
                    </>
                )}
            </Text>

            <View style={styles.cardForm}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#555"
                    keyboardType="numeric"
                    maxLength={16}
                    value={cardNumber}
                    onChangeText={setCardNumber}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={styles.label}>Expiry</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM/YY"
                            placeholderTextColor="#555"
                            maxLength={5}
                            value={expiry}
                            onChangeText={setExpiry}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>CVC</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123"
                            placeholderTextColor="#555"
                            keyboardType="numeric"
                            maxLength={3}
                            secureTextEntry
                            value={cvc}
                            onChangeText={setCvc}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.secureBadge}>
                <Text style={{ fontSize: 12, color: '#888' }}>🔒 Encrypted via Stripe (Mock)</Text>
            </View>

            <Pressable style={styles.payBtn} onPress={handlePay} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.payBtnText}>
                        {trialDuration ? `Start ${trialDuration} Trial` : `Pay ${amount}`}
                    </Text>
                )}
            </Pressable>

            {trialDuration && (
                <Text style={{ color: '#666', fontSize: 11, textAlign: 'center', marginTop: -10, marginBottom: 16 }}>
                    You won't be charged until your trial ends. Cancel anytime.
                </Text>
            )}

            <Pressable onPress={onCancel} style={styles.cancelBtn} disabled={loading}>
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    cardForm: {
        backgroundColor: '#1c1c1e', // Darker card background
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#333', // Subtle border
    },
    label: {
        color: '#aaa',
        marginBottom: 8,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: '#111', // Deep black input
        color: '#fff',
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333'
    },
    row: {
        flexDirection: 'row',
    },
    payBtn: {
        backgroundColor: Colors.dark.primary, // Brand Primary instead of Green
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    payBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    cancelBtn: {
        alignItems: 'center',
        padding: 8,
    },
    cancelText: {
        color: '#888',
    },
    secureBadge: {
        alignItems: 'center',
        marginBottom: 20,
    }
});
