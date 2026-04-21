import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsActionItemProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    iconColor: string;
    textColor?: string;
    subTextColor?: string;
}

export function SettingsActionItem({ label, icon, onPress, iconColor, textColor = '#fff', subTextColor = '#666' }: SettingsActionItemProps) {
    return (
        <Pressable style={styles.actionItem} onPress={onPress}>
            <View style={styles.actionInfo}>
                <Ionicons name={icon} size={20} color={iconColor} />
                <Text style={[styles.actionText, { color: textColor }]}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={subTextColor} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    actionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '500',
    },
});
