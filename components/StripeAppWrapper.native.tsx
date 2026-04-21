import { StripeProvider } from '@stripe/stripe-react-native';
import React from 'react';

// Replace with your actual Stripe Publishable Key
const STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_123456789';

export function StripeAppWrapper({ children }: { children: React.ReactNode }) {
    return (
        <StripeProvider publishableKey={STRIPE_KEY}>
            <>{children}</>
        </StripeProvider>
    );
}
