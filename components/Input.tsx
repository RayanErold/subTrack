
import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Colors from '../constants/Colors';
import { useSubscriptionStore } from '../store/useSubscriptionStore';

interface Props extends TextInputProps {
    label: string;
}

export default function Input({ label, style, ...props }: Props) {
    const { theme } = useSubscriptionStore();
    const currentFont = (theme.enabled && theme.font !== 'System') ? theme.font : undefined;

    const isLightBg = theme.enabled && (theme.backgroundColor === '#ffffff' || theme.backgroundColor.toLowerCase() === 'white');
    const textColor = isLightBg ? '#000' : '#fff';
    const subTextColor = isLightBg ? '#666' : '#bbb';
    const inputBg = isLightBg ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)';
    const inputBorder = isLightBg ? 'rgba(0,0,0,0.1)' : '#333';

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { fontFamily: currentFont, color: subTextColor }]}>{label}</Text>
            <TextInput
                style={[styles.input, { fontFamily: currentFont, backgroundColor: inputBg, borderColor: inputBorder, color: textColor }, style]}
                placeholderTextColor={isLightBg ? '#999' : '#666'}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    label: {
        color: '#bbb',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
    },
});
