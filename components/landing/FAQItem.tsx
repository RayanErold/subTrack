import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FAQItemProps {
    q: string;
    a: string;
}

export function FAQItem({ q, a }: FAQItemProps) {
    const [open, setOpen] = useState(false);
    return (
        <TouchableOpacity style={styles.faqItem} onPress={() => setOpen(!open)} activeOpacity={0.8}>
            <View style={styles.faqHead}>
                <Text style={styles.faqQ}>{q}</Text>
                <Ionicons name={open ? "remove" : "add"} size={20} color="#666" />
            </View>
            {open && <Text style={styles.faqA}>{a}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    faqItem: { 
        backgroundColor: '#111', 
        marginBottom: 16, 
        borderRadius: 16, 
        padding: 20, 
        borderWidth: 1, 
        borderColor: '#1f1f1f' 
    },
    faqHead: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    faqQ: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600', 
        flex: 1, 
        marginRight: 16 
    },
    faqA: { 
        color: '#aaa', 
        marginTop: 12, 
        lineHeight: 24 
    },
});
