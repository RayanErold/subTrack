import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReviewCardProps {
    name: string;
    handle: string;
    text: string;
}

export function ReviewCard({ name, handle, text }: ReviewCardProps) {
    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{name[0]}</Text>
                </View>
                <View>
                    <Text style={styles.reviewName}>{name}</Text>
                    <Text style={styles.reviewHandle}>{handle}</Text>
                </View>
            </View>
            <Text style={styles.reviewText}>{text}</Text>
            <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map(i => <Ionicons key={i} name="star" size={14} color="#FFD700" />)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    reviewCard: { 
        width: 320, 
        backgroundColor: '#111', 
        padding: 24, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: '#222' 
    },
    reviewHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 16 
    },
    avatar: { 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        backgroundColor: '#222', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    avatarText: { 
        color: '#fff', 
        fontWeight: '700' 
    },
    reviewName: { 
        color: '#fff', 
        fontWeight: '700', 
        fontSize: 15 
    },
    reviewHandle: { 
        color: '#666', 
        fontSize: 12 
    },
    reviewText: { 
        color: '#ccc', 
        lineHeight: 24, 
        marginBottom: 16 
    },
    stars: { 
        flexDirection: 'row', 
        gap: 4 
    },
});
