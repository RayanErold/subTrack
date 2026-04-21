import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsSectionHeaderProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

export function SettingsSectionHeader({ title, icon, color }: SettingsSectionHeaderProps) {
    return (
        <View style={styles.sectionHeader}>
            <Ionicons name={icon} size={20} color={color} />
            <Text style={[styles.sectionHeaderText, { color }]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
