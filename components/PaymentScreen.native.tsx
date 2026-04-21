import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import Colors from '../constants/Colors';
import { logPayment } from '../utils/payment';
import { sendPaymentConfirmation } from '../utils/email';
import { supabase } from '../utils/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen() {
    const { createPaymentMethod } = useStripe();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState<any>(null);

    const handlePayPress = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
            return;
        }

        if (!cardDetails?.complete) {
            Alert.alert('Invalid Card', 'Please enter complete card details.');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Payment Method (Frontend)
            // In a real app, you would fetch a PaymentIntent clientSecret from your backend here.
            // For this frontend-only demo, we just create a PaymentMethod to validate the card.
            const { paymentMethod, error } = await createPaymentMethod({
                paymentMethodType: 'Card',
            });

            if (error) {
                console.log('Stripe Error:', error);
                Alert.alert('Payment Failed', error.message);
                setLoading(false);
                return;
            }

            if (paymentMethod) {
                console.log('Payment Method Created:', paymentMethod.id);

                // 2. Log to Supabase
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    Alert.alert('Error', 'User not logged in');
                    setLoading(false);
                    return;
                }

                const paymentAmount = parseFloat(amount);

                // "Mock" successful payment on backend
                await logPayment({
                    user_id: user.id,
                    amount: paymentAmount,
                    currency: 'USD',
                    status: 'succeeded',
                });

                // 3. Send Email Notification
                if (user.email) {
                    await sendPaymentConfirmation(user.email, paymentAmount);
                }

                Alert.alert('Success', 'Payment processed successfully!');
                setAmount('');
                // Clear card (implementation depends on how you handle ref, but strictly UI clear isn't always exposed by CardField easily without unmount)
            }
        } catch (e: any) {
            console.error(e);
            Alert.alert('Error', e.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Secure Payment</Text>
            <Text style={styles.subtitle}>Upgrade to Premium Features</Text>

            <ScrollView contentContainerStyle={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount (USD)</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="20.00"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Card Details</Text>
                    <View style={styles.cardContainer}>
                        <CardField
                            postalCodeEnabled={false}
                            style={styles.cardField}
                            cardStyle={{
                                backgroundColor: '#1E1E1E', // Matching dark theme roughly
                                textColor: '#FFFFFF',
                                borderWidth: 0,
                            }}
                            onCardChange={(cardDetails) => {
                                setCardDetails(cardDetails);
                            }}
                        />
                    </View>
                </View>

                <Pressable
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handlePayPress}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Pay Now</Text>
                    )}
                </Pressable>

                <Text style={styles.disclaimer}>
                    This is a demo. No real money will be charged. Use Stripe Test Cards (e.g. 4242 4242 4242 4242).
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: Colors.dark.background,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 32,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: '#ddd',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
    },
    icon: {
        marginRight: 10,
    },
    cardContainer: {
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardField: {
        width: '100%',
        height: 50,
    },
    button: {
        backgroundColor: Colors.dark.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disclaimer: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
    }
});
