import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

interface PlanCardProps {
    title: string;
    price: string;
    period: string;
    isBestValue?: boolean;
    trial?: string;
    features: string[];
}

export function PlanCard({ title, price, period, isBestValue, trial, features }: PlanCardProps) {
    return (
        <View style={[styles.planCard, isBestValue && styles.planCardActive]}>
            {isBestValue && <Text style={styles.bestValueText}>BEST VALUE</Text>}
            <Text style={styles.planCardTitle}>{title}</Text>
            <Text style={styles.planCardPrice}>{price}<Text style={{ fontSize: 14, color: '#888' }}>{period}</Text></Text>

            {trial && (
                <View style={styles.trialBadge}>
                    <Text style={styles.trialText}>{trial}</Text>
                </View>
            )}

            <View style={{ marginVertical: 16, gap: 8, width: '100%' }}>
                {features?.map((f: string, i: number) => (
                    <Text key={i} style={{ color: '#aaa', fontSize: 12, textAlign: 'center' }}>• {f}</Text>
                ))}
            </View>

            <TouchableOpacity style={[styles.planBtn, isBestValue ? { backgroundColor: Colors.dark.primary } : { backgroundColor: '#333' }]}>
                <Text style={styles.planBtnText}>Select</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    planCard: { 
        flex: 1, 
        backgroundColor: '#111', 
        padding: 24, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: '#222', 
        alignItems: 'center' 
    },
    planCardActive: {
        borderColor: Colors.dark.primary,
        backgroundColor: 'rgba(108, 99, 255, 0.05)',
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10
    },
    bestValueText: { 
        color: Colors.dark.primary, 
        fontSize: 10, 
        fontWeight: '800', 
        marginBottom: 8 
    },
    planCardTitle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 8 
    },
    planCardPrice: { 
        color: '#fff', 
        fontSize: 32, 
        fontWeight: '800', 
        marginBottom: 16 
    },
    trialBadge: { 
        backgroundColor: 'rgba(255, 215, 0, 0.15)', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 8, 
        marginBottom: 8 
    },
    trialText: { 
        color: '#FFD700', 
        fontSize: 10, 
        fontWeight: '700' 
    },
    planBtn: { 
        width: '100%', 
        paddingVertical: 12, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginTop: 'auto' 
    },
    planBtnText: { 
        color: '#fff', 
        fontWeight: '600' 
    },
});
