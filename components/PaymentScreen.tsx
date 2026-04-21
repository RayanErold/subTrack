import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Secure Payment</Text>
            <Text style={styles.subtitle}>Upgrade to Premium Features</Text>

            <View style={styles.card}>
                <Ionicons name="desktop-outline" size={48} color={Colors.dark.tint} style={{ marginBottom: 16 }} />
                <Text style={styles.message}>
                    In-app payments are currently only available on the mobile app.
                </Text>
                <Text style={styles.suggestion}>
                    Please switch to the mobile application to upgrade your subscription.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
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
    card: {
        backgroundColor: '#1E1E1E',
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        maxWidth: 400,
        width: '100%',
    },
    message: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 12,
    },
    suggestion: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
    },
});
