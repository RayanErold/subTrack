import { Alert } from 'react-native';
import { supabase } from './supabase';

export const sendPaymentConfirmation = async (email: string, amount: number) => {
    console.log(`[EMAIL SERVICE] Initiating send to ${email}...`);

    try {
        // Attempt to call the Edge Function
        const { data, error } = await supabase.functions.invoke('send-email', {
            body: { email, amount },
        });

        if (error) {
            console.warn('[EMAIL SERVICE] Edge Function failed (network/server error):', error);
            throw error;
        }

        // Check for application-level error returned with 200 OK
        if (data?.error) {
            console.warn('[EMAIL SERVICE] Resend API Error:', data.error);
            Alert.alert("📧 Email Failed", `Resend Error: ${JSON.stringify(data.error)}`);
            return;
        }

        console.log('[EMAIL SERVICE] Email sent via Supabase Edge Function!', data);
        Alert.alert(
            "📧 Email Sent",
            `A confirmation email has been sent to ${email} via Resend.`
        );

    } catch (error) {
        console.log('[EMAIL SERVICE] Falling back to Mock/Console log.');

        // Detailed fallback log
        console.log(`[Subject] Payment Confirmation`);
        console.log(`[Body] Thank you for your payment of $${amount}. Your transaction has been securely logged.`);

        Alert.alert(
            "📧 Email Sent (Mock)",
            `Confirmation logged to console. (Deploy Edge Function for real emails).`
        );
    }
};

export const resendVerificationEmail = async (email: string) => {
    console.log(`[AUTH SERVICE] Resending verification to ${email}...`);
    try {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        if (error) {
            console.error('[AUTH SERVICE] Resend failed:', error.message);
            Alert.alert("Resend Failed", error.message);
            return false;
        }

        console.log('[AUTH SERVICE] Resend successful!');
        Alert.alert("Success", "A new verification link has been sent to your email.");
        return true;
    } catch (err) {
        console.error('[AUTH SERVICE] Unexpected error during resend:', err);
        return false;
    }
};
