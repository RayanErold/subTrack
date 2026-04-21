import React from 'react';

// Web wrapper that does nothing but render children
// This prevents @stripe/stripe-react-native from breaking the web build
export function StripeAppWrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
