import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface BenefitCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    desc: string;
}

export function BenefitCard({ icon, title, desc }: BenefitCardProps) {
    return (
        <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
                <Ionicons name={icon} size={24} color={Colors.dark.primary} />
            </View>
            <View>
                <Text style={styles.benefitTitle}>{title}</Text>
                <Text style={styles.benefitDesc}>{desc}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    benefitCard: { 
        width: '100%', 
        minWidth: 280, 
        flex: 1, 
        backgroundColor: '#111', 
        padding: 24, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: '#222' 
    },
    benefitIcon: { 
        width: 48, 
        height: 48, 
        borderRadius: 14, 
        backgroundColor: '#1a1a1a', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 16 
    },
    benefitTitle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 8 
    },
    benefitDesc: { 
        color: '#888', 
        lineHeight: 24 
    },
});
