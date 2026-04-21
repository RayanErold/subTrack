import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import PaymentSheet from './PaymentSheet';
import { Ionicons } from '@expo/vector-icons';

// Benefits Data
const benefits = [
    { icon: 'infinite', title: 'Unlimited Subscriptions', desc: 'Track as many as you want.' },
    { icon: 'calendar-outline', title: 'Calendar Sync', desc: 'Auto-sync with Google Calendar.' },
    { icon: 'document-text-outline', title: 'PDF & CSV Exports', desc: 'Export for tax season.' },
    { icon: 'globe-outline', title: 'Multi-Currency', desc: 'USD, EUR, GBP & more.' },
];

interface Props {
    visible: boolean;
    onClose: () => void;
    onPurchase: () => void;
}

export default function Paywall({ visible, onClose, onPurchase }: Props) {
    const [mode, setMode] = useState<'pitch' | 'payment'>('pitch');
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');

    const handlePurchaseSuccess = () => {
        onPurchase();
        setTimeout(() => {
            setMode('pitch'); // Reset for next time
        }, 500);
    };

    const getButtonText = () => {
        switch (selectedPlan) {
            case 'monthly': return 'Start 1-Month Free Trial';
            case 'yearly': return 'Start 5-Month Free Trial';
            case 'lifetime': return 'Get Lifetime Access';
        }
    };

    const getPriceText = () => {
        switch (selectedPlan) {
            case 'monthly': return 'then $4.99/mo';
            case 'yearly': return 'then $39.99/yr';
            case 'lifetime': return '$49.99 one-time';
        }
    };

    const getPaymentAmount = () => {
        switch (selectedPlan) {
            case 'monthly': return '$4.99';
            case 'yearly': return '$39.99';
            case 'lifetime': return '$49.99';
        }
    };

    const getPlanName = () => {
        switch (selectedPlan) {
            case 'monthly': return 'Monthly Pro';
            case 'yearly': return 'Yearly Pro';
            case 'lifetime': return 'Lifetime Access';
        }
    };

    const getTrialDuration = () => {
        switch (selectedPlan) {
            case 'monthly': return '1 Month';
            case 'yearly': return '5 Months';
            case 'lifetime': return undefined;
        }
    };

    const content = mode === 'pitch' ? (
        <>
            <ScrollView style={styles.features} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.diamondContainer}>
                        <Ionicons name="diamond-outline" size={48} color={Colors.dark.primary} />
                    </View>
                    <Text style={styles.title}>Unlock Premium</Text>
                    <Text style={styles.subtitle}>Remove limits. Predict your wealth.</Text>
                </View>

                {/* Features */}
                <View style={styles.featuresList}>
                    {benefits.map((b, i) => (
                        <View key={i} style={styles.featureRow}>
                            <View style={styles.featureIconBox}>
                                <Ionicons name={b.icon as any} size={20} color={Colors.dark.primary} />
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text style={styles.featureTitle}>{b.title}</Text>
                                <Text style={styles.featureDesc}>{b.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Plans */}
                <Text style={styles.planHeader}>CHOOSE YOUR PLAN</Text>
                <View style={styles.plansContainer}>
                    {/* Yearly */}
                    <Pressable
                        style={[styles.planCard, selectedPlan === 'yearly' && styles.selectedPlan]}
                        onPress={() => setSelectedPlan('yearly')}
                    >
                        <View style={styles.badgetTag}>
                            <Text style={styles.badgeText}>BEST VALUE</Text>
                        </View>
                        <View style={styles.planRow}>
                            <Text style={styles.planTitle}>Yearly</Text>
                            <Text style={styles.planPrice}>$39.99/yr</Text>
                        </View>
                        <Text style={styles.trialText}>5 Months Free Trial</Text>
                    </Pressable>

                    {/* Monthly */}
                    <Pressable
                        style={[styles.planCard, selectedPlan === 'monthly' && styles.selectedPlan]}
                        onPress={() => setSelectedPlan('monthly')}
                    >
                        <View style={styles.planRow}>
                            <Text style={styles.planTitle}>Monthly</Text>
                            <Text style={styles.planPrice}>$4.99/mo</Text>
                        </View>
                        <Text style={styles.trialText}>1 Month Free Trial</Text>
                    </Pressable>

                    {/* Lifetime */}
                    <Pressable
                        style={[styles.planCard, selectedPlan === 'lifetime' && styles.selectedPlan]}
                        onPress={() => setSelectedPlan('lifetime')}
                    >
                        <View style={styles.planRow}>
                            <Text style={styles.planTitle}>Lifetime</Text>
                            <Text style={styles.planPrice}>$49.99</Text>
                        </View>
                        <Text style={styles.trialText}>Pay once, own forever</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Footer / CTA */}
            <View style={styles.footer}>
                <Pressable style={styles.btn} onPress={() => setMode('payment')}>
                    <Text style={styles.btnText}>{getButtonText()}</Text>
                    <View style={styles.btnSubRow}>
                        <Ionicons name="lock-closed" size={10} color="rgba(255,255,255,0.6)" style={{ marginRight: 4 }} />
                        <Text style={styles.btnSubtext}>{getPriceText()}</Text>
                    </View>
                </Pressable>
                <Pressable onPress={onClose} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>No thanks, I'll allow limits</Text>
                </Pressable>
            </View>
        </>
    ) : (
        <PaymentSheet
            amount={getPaymentAmount()}
            planName={getPlanName()}
            trialDuration={getTrialDuration()}
            onSuccess={handlePurchaseSuccess}
            onCancel={() => setMode('pitch')}
        />
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, mode === 'payment' && { height: 'auto' }]}>
                    {content}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#050505',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 20,
        paddingBottom: 30,
        height: '88%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 10,
    },
    diamondContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(108, 99, 255, 0.2)',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    features: {
        flex: 1,
    },
    featuresList: {
        marginBottom: 24,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    featureDesc: {
        color: '#555',
        fontSize: 11,
    },
    planHeader: {
        color: '#666',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 16,
        marginTop: 8,
        marginLeft: 4,
        letterSpacing: 1,
    },
    plansContainer: {
        gap: 10,
        marginBottom: 24,
    },
    planCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        position: 'relative',
    },
    selectedPlan: {
        borderColor: Colors.dark.primary,
        backgroundColor: 'rgba(108, 99, 255, 0.08)',
    },
    planRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    planTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    planPrice: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    trialText: {
        color: Colors.dark.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    badgetTag: {
        position: 'absolute',
        top: -10,
        right: 12,
        backgroundColor: Colors.dark.warning,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        overflow: 'hidden',
    },
    badgeText: {
        color: '#000',
        fontSize: 9,
        fontWeight: '900',
    },
    footer: {
        marginTop: 10,
    },
    btn: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    btnSubRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    btnSubtext: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
    },
    cancelBtn: {
        alignItems: 'center',
        marginTop: 8,
    },
    cancelText: {
        color: '#444',
        fontSize: 12,
        fontWeight: '600',
    },
    restoreText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600'
    }
});
