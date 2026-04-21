import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeatureRowProps {
    text: string;
}

export function FeatureRow({ text }: FeatureRowProps) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 }}>
            <Ionicons name="checkmark-circle" size={18} color="#4ADE80" />
            <Text style={{ color: '#ddd', fontSize: 15 }}>{text}</Text>
        </View>
    );
}
