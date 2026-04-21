import React, { useState } from 'react';
import { Alert, StyleSheet, View, TextInput, Pressable, Text, ActivityIndicator } from 'react-native';
import { supabase } from '../../utils/supabase';
import { resendVerificationEmail } from '../../utils/email';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [sentVerification, setSentVerification] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert('Error', error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            setSentVerification(true);
            Alert.alert('Success', 'Check your inbox for email verification!');
        }
        setLoading(false);
    }

    async function handleResend() {
        if (!email) {
            Alert.alert("Email Required", "Please enter your email to resend the verification link.");
            return;
        }
        setLoading(true);
        await resendVerificationEmail(email);
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Ionicons name="wallet-outline" size={60} color={Colors.dark.primary} />
                <Text style={styles.title}>SubsTracker</Text>
            </View>

            <View style={styles.form}>
                <View>
                    <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder="email@address.com"
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View>
                    <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            secureTextEntry={!showPassword}
                            placeholder="Password"
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
                        </Pressable>
                    </View>
                </View>

                <Pressable
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={() => isSignUp ? signUpWithEmail() : signInWithEmail()}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
                    )}
                </Pressable>

                <Pressable
                    style={styles.switchButton}
                    onPress={() => {
                        setIsSignUp(!isSignUp);
                        setSentVerification(false);
                    }}
                >
                    <Text style={styles.switchText}>
                        {isSignUp ? 'Already have an account? Sign In' : 'New here? Sign Up'}
                    </Text>
                </Pressable>

                {(isSignUp || sentVerification) && (
                    <Pressable
                        style={[styles.resendButton, loading && styles.buttonDisabled]}
                        onPress={handleResend}
                        disabled={loading}
                    >
                        <Text style={styles.resendText}>Didn't get the email? Resend Link</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: Colors.dark.background,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    form: {
        gap: 16,
    },
    label: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    required: {
        color: Colors.dark.secondary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: Colors.dark.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchButton: {
        alignItems: 'center',
        marginTop: 16,
    },
    switchText: {
        color: Colors.dark.tint,
        fontSize: 14,
    },
    resendButton: {
        alignItems: 'center',
        marginTop: 12,
        padding: 8,
    },
    resendText: {
        color: '#666',
        fontSize: 13,
        textDecorationLine: 'underline',
    },
});
